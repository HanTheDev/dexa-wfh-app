# Database Schema Design

## Entities & Relationships

### 1. Users (Authentication)
- One User can have One Employee profile
- Users has role: 'admin' or 'employee'

### 2. Employees (Master Data)
- One Employee belongs to One User
- One Employee has Many Attendances

### 3. Attendances (Transaction Data)
- Many Attendances belong to One Employee
- Each attendance has one photo proof

## ERD Diagram
```
Users (1) ----< (1) Employees (1) ----< (Many) Attendances
```