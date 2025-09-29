"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Simple translation function - replace with actual translations
const translations: Record<string, Record<string, string>> = {
  en: {
    Employees: "Employees",
    "Manage your organization's employees and their information":
      "Manage your organization's employees and their information",
    Refresh: "Refresh",
    Export: "Export",
    "Add Employee": "Add Employee",
    "Add New Employee": "Add New Employee",
    "First Name": "First Name",
    "Last Name": "Last Name",
    Email: "Email",
    Phone: "Phone",
    Department: "Department",
    Position: "Position",
    Manager: "Manager",
    Salary: "Salary",
    Location: "Location",
    "Work Type": "Work Type",
    Cancel: "Cancel",
    "Total Employees": "Total Employees",
    Active: "Active",
    "On Leave": "On Leave",
    "Avg Performance": "Avg Performance",
    "Search employees...": "Search employees...",
    Filters: "Filters",
    "All Departments": "All Departments",
    "All Statuses": "All Statuses",
    "All Work Types": "All Work Types",
    "Sort by": "Sort by",
    "Hire Date": "Hire Date",
    Name: "Name",
    Salary: "Salary",
    "employees selected": "employees selected",
    "Export Selected": "Export Selected",
    "Deactivate Selected": "Deactivate Selected",
    Employee: "Employee",
    Performance: "Performance",
    Actions: "Actions",
    "View Details": "View Details",
    Previous: "Previous",
    Page: "Page",
    of: "of",
    Next: "Next",
    "Employee Details": "Employee Details",
    Overview: "Overview",
    Documents: "Documents",
    Status: "Status",
    Inactive: "Inactive",
    Terminated: "Terminated",
    "Present Days": "Present Days",
    Absent: "Absent",
    Leave: "Leave",
    Contract: "Contract",
    "View Contract": "View Contract",
    "ID Document": "ID Document",
    "View ID": "View ID",
    Certificates: "Certificates",
    Certificate: "Certificate",
    "Upload Document": "Upload Document",
    "Select an Employee": "Select an Employee",
    "Choose an employee from the list to view their details and manage their information.":
      "Choose an employee from the list to view their details and manage their information.",
    "Select department": "Select department",
    Engineering: "Engineering",
    Product: "Product",
    Design: "Design",
    Marketing: "Marketing",
    Sales: "Sales",
    HR: "HR",
    "Select work type": "Select work type",
    "Full-time": "Full-time",
    "Part-time": "Part-time",
    Contract: "Contract",
    Intern: "Intern",
    Success: "Success",
    "Employee created successfully.": "Employee created successfully.",
    "Employee status updated successfully.": "Employee status updated successfully.",
    "No Selection": "No Selection",
    "Please select employees first.": "Please select employees first.",
    "Selected employees deactivated.": "Selected employees deactivated.",
    "Export Successful": "Export Successful",
    "Employee data has been exported successfully.": "Employee data has been exported successfully.",
    Retry: "Retry",
    "Last Review": "Last Review",
    Attendance: "Attendance",
    "Overall Rating": "Overall Rating",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("en")

  const t = (key: string): string => {
    return translations[language]?.[key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
