import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Supported languages and their frameworks
    const supportedLanguages = {
      python: {
        frameworks: ["sqlalchemy", "django", "tortoise-orm", "peewee"],
        description: "Python ORMs for database management",
      },
      javascript: {
        frameworks: ["prisma", "typeorm", "sequelize", "mongoose"],
        description: "JavaScript/TypeScript ORMs",
      },
      typescript: {
        frameworks: ["prisma", "typeorm", "mikro-orm"],
        description: "TypeScript ORMs with type safety",
      },
      java: {
        frameworks: ["spring-data-jpa", "hibernate", "mybatis"],
        description: "Java persistence frameworks",
      },
      go: {
        frameworks: ["gorm", "sqlx", "ent"],
        description: "Go database frameworks",
      },
      csharp: {
        frameworks: ["entity-framework", "dapper", "nhibernate"],
        description: "C# database frameworks",
      },
      ruby: {
        frameworks: ["activerecord", "sequel", "rom"],
        description: "Ruby ORMs",
      },
      php: {
        frameworks: ["laravel-eloquent", "doctrine", "propel"],
        description: "PHP ORMs",
      },
    };

    return NextResponse.json(supportedLanguages);
  } catch (error: any) {
    console.error("Error fetching supported languages:", error);
    return NextResponse.json(
      { error: "Failed to fetch supported languages" },
      { status: 500 }
    );
  }
}
