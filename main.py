from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from google import genai
import json
import re

app = FastAPI(title="Database Schema Generator API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class ProjectDescriptionInput(BaseModel):
    description: str = Field(..., description="Project description for database schema generation")
    api_key: str = Field(..., description="Gemini API Key")
    model_name: str = Field(default="gemini-2.0-flash-exp", description="Gemini model name")

class Question(BaseModel):
    id: str
    question: str
    options: List[str]

class QuestionsResponse(BaseModel):
    session_id: str
    questions: List[Question]
    project_description: str

class AnswersInput(BaseModel):
    session_id: str
    answers: Dict[str, str] = Field(..., description="Dictionary of question_id: selected_option")

class TableInfo(BaseModel):
    table_name: str
    description: str
    sequence_order: int

class DetailedPromptResponse(BaseModel):
    session_id: str
    detailed_prompt: str
    tables: List[TableInfo]

class TableSchemaRequest(BaseModel):
    session_id: str
    table_name: str

class TableSchemaResponse(BaseModel):
    table_name: str
    sql_schema: str
    relationships: List[str]

# In-memory session storage (use Redis/DB in production)
sessions = {}

def get_gemini_client(api_key: str):
    """Create Gemini client with provided API key"""
    return genai.Client(api_key=api_key)

def extract_json_from_response(text: str) -> dict:
    """Extract JSON from Gemini response text"""
    # Remove markdown code blocks if present
    text = re.sub(r'```json\s*', '', text)
    text = re.sub(r'```\s*', '', text)
    
    # Try to find JSON object
    json_match = re.search(r'\{.*\}', text, re.DOTALL)
    if json_match:
        return json.loads(json_match.group())
    else:
        raise ValueError("No valid JSON found in response")

# Step 1: Generate contextual questions based on project description
@app.post("/api/v1/generate-questions", response_model=QuestionsResponse)
async def generate_questions(input_data: ProjectDescriptionInput):
    """
    Generate contextual questions based on the project description
    """
    try:
        client = get_gemini_client(input_data.api_key)
        
        prompt = f"""
Based on the following project description, generate 5-7 relevant questions to understand the database requirements better.

Project Description:
{input_data.description}

Generate questions about:
1. Project complexity level (Simple/Moderate/Complex/Enterprise)
2. Expected scale/number of users (Small <1K/Medium 1K-100K/Large 100K-1M/Enterprise >1M)
3. Data relationships complexity (Simple/Moderate/Complex)
4. Performance requirements (Basic/Standard/High/Critical)
5. Security level (Basic/Standard/High/Enterprise)
6. Additional domain-specific considerations

Return the response in the following JSON format:
{{
  "questions": [
    {{
      "id": "q1",
      "question": "What is the complexity level of the project?",
      "options": ["Simple", "Moderate", "Complex", "Enterprise"]
    }},
    {{
      "id": "q2",
      "question": "What is the expected scale/number of users?",
      "options": ["Small (<1K)", "Medium (1K-100K)", "Large (100K-1M)", "Enterprise (>1M)"]
    }}
  ]
}}

Ensure questions are relevant to the project description provided.
"""
        
        response = client.models.generate_content(
            model=input_data.model_name,
            contents=prompt
        )
        
        response_text = response.text.strip()
        questions_data = extract_json_from_response(response_text)
        
        # Create session
        session_id = f"session_{len(sessions) + 1}"
        sessions[session_id] = {
            "project_description": input_data.description,
            "questions": questions_data["questions"],
            "api_key": input_data.api_key,
            "model_name": input_data.model_name
        }
        
        return QuestionsResponse(
            session_id=session_id,
            questions=[Question(**q) for q in questions_data["questions"]],
            project_description=input_data.description
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating questions: {str(e)}")

# Step 2: Generate detailed prompt with table information
@app.post("/api/v1/generate-detailed-prompt", response_model=DetailedPromptResponse)
async def generate_detailed_prompt(answers_input: AnswersInput):
    """
    Generate detailed database design prompt based on answers
    """
    try:
        if answers_input.session_id not in sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session = sessions[answers_input.session_id]
        project_desc = session["project_description"]
        client = get_gemini_client(session["api_key"])
        
        # Format answers for prompt
        answers_text = "\n".join([f"- {k}: {v}" for k, v in answers_input.answers.items()])
        
        prompt = f"""
You are a database architect. Based on the project description and answers provided, create a comprehensive database design plan.

Project Description:
{project_desc}

User Requirements:
{answers_text}

Create a detailed database design that includes:
1. All necessary tables with clear descriptions
2. Table relationships and dependencies
3. Proper sequencing for table creation (considering foreign key dependencies)
4. Data types considerations
5. Indexing recommendations
6. Constraints and validations

Return the response in the following JSON format:
{{
  "design_overview": "Overall database design explanation",
  "tables": [
    {{
      "table_name": "users",
      "sequence_order": 1,
      "description": "Detailed description including columns, primary keys, foreign keys, indexes, and relationships with other tables",
      "dependencies": []
    }},
    {{
      "table_name": "orders",
      "sequence_order": 2,
      "description": "Detailed description including columns, primary keys, foreign keys, indexes, and relationships with other tables",
      "dependencies": ["users"]
    }}
  ]
}}

Ensure tables are ordered by dependency (tables with no foreign keys first, then tables that depend on them).
Provide comprehensive details for each table so it can be used to generate SQL schema.
"""
        
        response = client.models.generate_content(
            model=session["model_name"],
            contents=prompt
        )
        
        response_text = response.text.strip()
        design_data = extract_json_from_response(response_text)
        
        # Store detailed prompt in session
        sessions[answers_input.session_id]["detailed_design"] = design_data
        
        # Create detailed prompt text
        detailed_prompt = f"{design_data['design_overview']}\n\nTables:\n"
        for table in design_data['tables']:
            detailed_prompt += f"\n{table['sequence_order']}. {table['table_name']}: {table['description']}\n"
        
        return DetailedPromptResponse(
            session_id=answers_input.session_id,
            detailed_prompt=detailed_prompt,
            tables=[
                TableInfo(
                    table_name=t["table_name"],
                    description=t["description"],
                    sequence_order=t["sequence_order"]
                ) for t in design_data["tables"]
            ]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating detailed prompt: {str(e)}")

# Step 3: Generate individual table schema
@app.post("/api/v1/generate-table-schema", response_model=TableSchemaResponse)
async def generate_table_schema(request: TableSchemaRequest):
    """
    Generate SQL schema for a specific table
    """
    try:
        if request.session_id not in sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session = sessions[request.session_id]
        
        if "detailed_design" not in session:
            raise HTTPException(status_code=400, detail="Detailed design not generated yet")
        
        client = get_gemini_client(session["api_key"])
        
        # Find table info
        table_info = None
        for table in session["detailed_design"]["tables"]:
            if table["table_name"] == request.table_name:
                table_info = table
                break
        
        if not table_info:
            raise HTTPException(status_code=404, detail=f"Table {request.table_name} not found")
        
        # Get all tables for context
        all_tables = [t["table_name"] for t in session["detailed_design"]["tables"]]
        
        prompt = f"""
Generate a complete SQL CREATE TABLE statement for the following table.

Table Information:
{table_info['description']}

Available tables in database: {', '.join(all_tables)}

Requirements:
1. Use PostgreSQL syntax (but keep it compatible with most SQL databases)
2. Include all appropriate columns with proper data types
3. Define PRIMARY KEY constraint
4. Define FOREIGN KEY constraints where applicable
5. Add NOT NULL constraints where appropriate
6. Include CHECK constraints for validation
7. Add indexes for performance (as separate CREATE INDEX statements)
8. Add comments explaining the purpose of the table

Return the response in the following JSON format:
{{
  "sql_schema": "Complete SQL CREATE TABLE statement with all constraints",
  "indexes": ["CREATE INDEX statements"],
  "relationships": ["Description of relationships with other tables"],
  "notes": "Additional implementation notes"
}}

Ensure the SQL is production-ready and follows best practices.
"""
        
        response = client.models.generate_content(
            model=session["model_name"],
            contents=prompt
        )
        
        response_text = response.text.strip()
        schema_data = extract_json_from_response(response_text)
        
        # Combine SQL schema with indexes
        full_schema = schema_data["sql_schema"]
        if "indexes" in schema_data and schema_data["indexes"]:
            full_schema += "\n\n-- Indexes\n" + "\n".join(schema_data["indexes"])
        
        if "notes" in schema_data:
            full_schema += f"\n\n-- Notes: {schema_data['notes']}"
        
        return TableSchemaResponse(
            table_name=request.table_name,
            sql_schema=full_schema,
            relationships=schema_data.get("relationships", [])
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating table schema: {str(e)}")

# Additional utility endpoints
@app.get("/api/v1/session/{session_id}")
async def get_session(session_id: str):
    """Get session information (excluding sensitive data)"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session_copy = sessions[session_id].copy()
    # Remove sensitive data
    session_copy.pop("api_key", None)
    return session_copy

@app.delete("/api/v1/session/{session_id}")
async def delete_session(session_id: str):
    """Delete session"""
    if session_id in sessions:
        del sessions[session_id]
        return {"message": "Session deleted successfully"}
    raise HTTPException(status_code=404, detail="Session not found")

@app.get("/api/v1/sessions")
async def list_sessions():
    """List all active sessions"""
    return {
        "sessions": list(sessions.keys()),
        "count": len(sessions)
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)