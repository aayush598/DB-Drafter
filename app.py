import streamlit as st
import requests
import json

# Page config
st.set_page_config(
    page_title="Database Schema Generator",
    page_icon="🗄️",
    layout="wide"
)

# API endpoint
API_BASE_URL = "http://localhost:8000"

# Initialize session state
if "step" not in st.session_state:
    st.session_state.step = 1
if "session_id" not in st.session_state:
    st.session_state.session_id = None
if "questions" not in st.session_state:
    st.session_state.questions = []
if "tables" not in st.session_state:
    st.session_state.tables = []
if "generated_schemas" not in st.session_state:
    st.session_state.generated_schemas = {}
if "project_description" not in st.session_state:
    st.session_state.project_description = ""
if "api_key" not in st.session_state:
    st.session_state.api_key = ""
if "model_name" not in st.session_state:
    st.session_state.model_name = "gemini-2.0-flash-exp"

# Header
st.title("🗄️ Database Schema Generator")
st.markdown("Generate comprehensive database schemas using AI")

# Sidebar for configuration
with st.sidebar:
    st.header("⚙️ Configuration")
    
    # API Key input
    api_key = st.text_input(
        "Gemini API Key",
        type="password",
        value=st.session_state.api_key,
        help="Enter your Google Gemini API key"
    )
    if api_key:
        st.session_state.api_key = api_key
    
    # Model selection
    model_name = st.selectbox(
        "Model",
        ["gemini-2.0-flash-lite", "gemini-1.5-flash", "gemini-1.5-pro"],
        index=0,
        help="Select the Gemini model to use"
    )
    st.session_state.model_name = model_name
    
    st.divider()
    
    # Progress indicator
    st.subheader("Progress")
    progress_steps = ["Project Description", "Questions", "Table Design", "Schema Generation"]
    for i, step_name in enumerate(progress_steps, 1):
        if i < st.session_state.step:
            st.success(f"✅ {step_name}")
        elif i == st.session_state.step:
            st.info(f"▶️ {step_name}")
        else:
            st.text(f"⏳ {step_name}")
    
    st.divider()
    
    # Reset button
    if st.button("🔄 Start Over", use_container_width=True):
        for key in list(st.session_state.keys()):
            if key not in ["api_key", "model_name"]:
                del st.session_state[key]
        st.session_state.step = 1
        st.rerun()

# Main content area
if not st.session_state.api_key:
    st.warning("⚠️ Please enter your Gemini API key in the sidebar to begin.")
    st.info("""
    ### How to get a Gemini API Key:
    1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
    2. Sign in with your Google account
    3. Click "Create API Key"
    4. Copy and paste the key in the sidebar
    """)
    st.stop()

# Step 1: Project Description
if st.session_state.step == 1:
    st.header("Step 1: Describe Your Project")
    
    project_description = st.text_area(
        "Project Description",
        value=st.session_state.project_description,
        height=200,
        placeholder="Example: An e-commerce platform with user authentication, product catalog, shopping cart, order management, and payment processing...",
        help="Describe your project in detail. Include features, user types, and main functionalities."
    )
    
    col1, col2 = st.columns([1, 4])
    with col1:
        if st.button("Generate Questions ➡️", type="primary", use_container_width=True):
            if not project_description.strip():
                st.error("Please enter a project description")
            else:
                with st.spinner("Generating questions..."):
                    try:
                        response = requests.post(
                            f"{API_BASE_URL}/api/v1/generate-questions",
                            json={
                                "description": project_description,
                                "api_key": st.session_state.api_key,
                                "model_name": st.session_state.model_name
                            }
                        )
                        
                        if response.status_code == 200:
                            data = response.json()
                            st.session_state.session_id = data["session_id"]
                            st.session_state.questions = data["questions"]
                            st.session_state.project_description = project_description
                            st.session_state.step = 2
                            st.success("Questions generated successfully!")
                            st.rerun()
                        else:
                            st.error(f"Error: {response.json().get('detail', 'Unknown error')}")
                    except Exception as e:
                        st.error(f"Error connecting to API: {str(e)}")

# Step 2: Answer Questions
elif st.session_state.step == 2:
    st.header("Step 2: Answer Questions")
    st.info(f"Session ID: `{st.session_state.session_id}`")
    
    st.markdown("**Project:** " + st.session_state.project_description[:200] + "...")
    
    st.divider()
    
    answers = {}
    
    for question in st.session_state.questions:
        st.subheader(question["question"])
        answer = st.radio(
            f"Select an option for {question['id']}",
            question["options"],
            key=question["id"],
            label_visibility="collapsed"
        )
        answers[question["id"]] = answer
    
    col1, col2, col3 = st.columns([1, 1, 3])
    with col1:
        if st.button("⬅️ Back", use_container_width=True):
            st.session_state.step = 1
            st.rerun()
    
    with col2:
        if st.button("Generate Design ➡️", type="primary", use_container_width=True):
            with st.spinner("Generating database design..."):
                try:
                    response = requests.post(
                        f"{API_BASE_URL}/api/v1/generate-detailed-prompt",
                        json={
                            "session_id": st.session_state.session_id,
                            "answers": answers
                        }
                    )
                    
                    if response.status_code == 200:
                        data = response.json()
                        st.session_state.tables = data["tables"]
                        st.session_state.detailed_prompt = data["detailed_prompt"]
                        st.session_state.step = 3
                        st.success("Database design generated successfully!")
                        st.rerun()
                    else:
                        st.error(f"Error: {response.json().get('detail', 'Unknown error')}")
                except Exception as e:
                    st.error(f"Error connecting to API: {str(e)}")

# Step 3: Review Table Design
elif st.session_state.step == 3:
    st.header("Step 3: Database Design Overview")
    
    with st.expander("📋 View Detailed Design Prompt", expanded=False):
        st.text_area(
            "Detailed Prompt",
            value=st.session_state.detailed_prompt,
            height=300,
            disabled=True
        )
    
    st.subheader("Tables to Generate")
    
    # Display tables in a nice format
    for table in sorted(st.session_state.tables, key=lambda x: x["sequence_order"]):
        with st.container():
            col1, col2 = st.columns([1, 4])
            with col1:
                st.metric("Order", f"#{table['sequence_order']}")
            with col2:
                st.markdown(f"**{table['table_name']}**")
                st.caption(table['description'][:150] + "...")
    
    st.divider()
    
    col1, col2, col3 = st.columns([1, 1, 3])
    with col1:
        if st.button("⬅️ Back", use_container_width=True):
            st.session_state.step = 2
            st.rerun()
    
    with col2:
        if st.button("Generate Schemas ➡️", type="primary", use_container_width=True):
            st.session_state.step = 4
            st.rerun()

# Step 4: Generate Schemas
elif st.session_state.step == 4:
    st.header("Step 4: Generate SQL Schemas")
    
    # Generate all schemas button
    if len(st.session_state.generated_schemas) < len(st.session_state.tables):
        if st.button("🚀 Generate All Schemas", type="primary"):
            progress_bar = st.progress(0)
            status_text = st.empty()
            
            for idx, table in enumerate(sorted(st.session_state.tables, key=lambda x: x["sequence_order"])):
                status_text.text(f"Generating schema for {table['table_name']}...")
                
                try:
                    response = requests.post(
                        f"{API_BASE_URL}/api/v1/generate-table-schema",
                        json={
                            "session_id": st.session_state.session_id,
                            "table_name": table["table_name"]
                        }
                    )
                    
                    if response.status_code == 200:
                        data = response.json()
                        st.session_state.generated_schemas[table["table_name"]] = data
                    else:
                        st.error(f"Error generating {table['table_name']}: {response.json().get('detail', 'Unknown error')}")
                
                except Exception as e:
                    st.error(f"Error for {table['table_name']}: {str(e)}")
                
                progress_bar.progress((idx + 1) / len(st.session_state.tables))
            
            status_text.text("✅ All schemas generated!")
            st.rerun()
    
    st.divider()
    
    # Display generated schemas
    if st.session_state.generated_schemas:
        st.subheader("Generated Schemas")
        
        # Tabs for each table
        tabs = st.tabs([table["table_name"] for table in sorted(st.session_state.tables, key=lambda x: x["sequence_order"])])
        
        for idx, table in enumerate(sorted(st.session_state.tables, key=lambda x: x["sequence_order"])):
            with tabs[idx]:
                if table["table_name"] in st.session_state.generated_schemas:
                    schema_data = st.session_state.generated_schemas[table["table_name"]]
                    
                    # SQL Schema
                    st.subheader("SQL Schema")
                    st.code(schema_data["sql_schema"], language="sql")
                    
                    # Download button
                    st.download_button(
                        label=f"📥 Download {table['table_name']}.sql",
                        data=schema_data["sql_schema"],
                        file_name=f"{table['table_name']}.sql",
                        mime="text/plain"
                    )
                    
                    # Relationships
                    if schema_data["relationships"]:
                        st.subheader("Relationships")
                        for rel in schema_data["relationships"]:
                            st.info(rel)
                else:
                    st.warning(f"Schema not generated yet for {table['table_name']}")
                    
                    if st.button(f"Generate {table['table_name']}", key=f"gen_{table['table_name']}"):
                        with st.spinner(f"Generating {table['table_name']}..."):
                            try:
                                response = requests.post(
                                    f"{API_BASE_URL}/api/v1/generate-table-schema",
                                    json={
                                        "session_id": st.session_state.session_id,
                                        "table_name": table["table_name"]
                                    }
                                )
                                
                                if response.status_code == 200:
                                    data = response.json()
                                    st.session_state.generated_schemas[table["table_name"]] = data
                                    st.success(f"Generated {table['table_name']} successfully!")
                                    st.rerun()
                                else:
                                    st.error(f"Error: {response.json().get('detail', 'Unknown error')}")
                            except Exception as e:
                                st.error(f"Error: {str(e)}")
        
        st.divider()
        
        # Download all schemas
        if len(st.session_state.generated_schemas) == len(st.session_state.tables):
            st.success("✅ All schemas generated!")
            
            # Combine all schemas
            all_schemas = ""
            for table in sorted(st.session_state.tables, key=lambda x: x["sequence_order"]):
                if table["table_name"] in st.session_state.generated_schemas:
                    all_schemas += f"\n-- Table: {table['table_name']}\n"
                    all_schemas += f"-- {'-' * 60}\n\n"
                    all_schemas += st.session_state.generated_schemas[table["table_name"]]["sql_schema"]
                    all_schemas += "\n\n"
            
            st.download_button(
                label="📥 Download Complete Schema (All Tables)",
                data=all_schemas,
                file_name="complete_database_schema.sql",
                mime="text/plain",
                type="primary"
            )
    
    # Back button
    col1, col2 = st.columns([1, 4])
    with col1:
        if st.button("⬅️ Back to Design", use_container_width=True):
            st.session_state.step = 3
            st.rerun()

# Footer
st.divider()
st.caption("Powered by Google Gemini 2.0 Flash | Built with FastAPI & Streamlit")