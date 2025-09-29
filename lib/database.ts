// Database configuration and connection utilities
export const DATABASE_CONFIG = {
  connectionString:
    "Server=PHIHUNG_275;Database=hr_management_system_v1;Trusted_Connection=True;TrustServerCertificate=True;",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
}

export interface DatabaseConnection {
  query<T>(sql: string, params?: any[]): Promise<T[]>
  execute(sql: string, params?: any[]): Promise<void>
  close(): Promise<void>
}

// Mock database implementation for client-side
export class MockDatabase implements DatabaseConnection {
  private data: Map<string, any[]> = new Map()

  constructor() {
    // Initialize with mock data
    this.data.set("employees", [
      {
        id: "1",
        employeeId: "EMP001",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@company.com",
        department: "Engineering",
        position: "Senior Software Engineer",
        status: "Active",
        hireDate: "2022-01-15",
        salary: 120000,
      },
    ])

    this.data.set("job_postings", [
      {
        id: "1",
        title: "Software Engineer",
        department: "Engineering",
        status: "Published",
        publishDate: "2024-01-01",
        applicants: 25,
      },
    ])

    this.data.set("candidates", [
      {
        id: "1",
        name: "Jane Smith",
        email: "jane.smith@email.com",
        position: "Software Engineer",
        status: "Screening",
        skills: ["React", "Node.js", "TypeScript"],
      },
    ])
  }

  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    // Mock implementation - in real app this would execute SQL
    const tableName = this.extractTableName(sql)
    return (this.data.get(tableName) || []) as T[]
  }

  async execute(sql: string, params?: any[]): Promise<void> {
    // Mock implementation for INSERT, UPDATE, DELETE operations
    console.log("Executing SQL:", sql, params)
  }

  async close(): Promise<void> {
    // Mock implementation
  }

  private extractTableName(sql: string): string {
    const match = sql.match(/FROM\s+(\w+)/i) || sql.match(/INTO\s+(\w+)/i) || sql.match(/UPDATE\s+(\w+)/i)
    return match ? match[1] : "unknown"
  }
}

export const db = new MockDatabase()

// SQL query builders
export const queries = {
  employees: {
    getAll: () => "SELECT * FROM employees WHERE status != 'Deleted'",
    getById: (id: string) => `SELECT * FROM employees WHERE id = '${id}'`,
    create: (employee: any) =>
      `INSERT INTO employees (${Object.keys(employee).join(", ")}) VALUES (${Object.values(employee)
        .map((v) => `'${v}'`)
        .join(", ")})`,
    update: (id: string, employee: any) =>
      `UPDATE employees SET ${Object.entries(employee)
        .map(([k, v]) => `${k} = '${v}'`)
        .join(", ")} WHERE id = '${id}'`,
    delete: (id: string) => `UPDATE employees SET status = 'Deleted' WHERE id = '${id}'`,
  },
  jobPostings: {
    getAll: () => "SELECT * FROM job_postings WHERE status != 'Deleted'",
    getById: (id: string) => `SELECT * FROM job_postings WHERE id = '${id}'`,
    create: (jobPosting: any) =>
      `INSERT INTO job_postings (${Object.keys(jobPosting).join(", ")}) VALUES (${Object.values(jobPosting)
        .map((v) => `'${v}'`)
        .join(", ")})`,
    update: (id: string, jobPosting: any) =>
      `UPDATE job_postings SET ${Object.entries(jobPosting)
        .map(([k, v]) => `${k} = '${v}'`)
        .join(", ")} WHERE id = '${id}'`,
    delete: (id: string) => `UPDATE job_postings SET status = 'Deleted' WHERE id = '${id}'`,
  },
  candidates: {
    getAll: () => "SELECT * FROM candidates WHERE status != 'Deleted'",
    getById: (id: string) => `SELECT * FROM candidates WHERE id = '${id}'`,
    create: (candidate: any) =>
      `INSERT INTO candidates (${Object.keys(candidate).join(", ")}) VALUES (${Object.values(candidate)
        .map((v) => `'${v}'`)
        .join(", ")})`,
    update: (id: string, candidate: any) =>
      `UPDATE candidates SET ${Object.entries(candidate)
        .map(([k, v]) => `${k} = '${v}'`)
        .join(", ")} WHERE id = '${id}'`,
    delete: (id: string) => `UPDATE candidates SET status = 'Deleted' WHERE id = '${id}'`,
  },
}
