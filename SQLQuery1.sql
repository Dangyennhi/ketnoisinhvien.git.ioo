CREATE DATABASE JobPortal;
GO

USE JobPortal;
GO

CREATE TABLE Applications (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Company NVARCHAR(255),
    Name NVARCHAR(255),
    Email NVARCHAR(255),
    AppliedAt DATETIME DEFAULT GETDATE()
);
