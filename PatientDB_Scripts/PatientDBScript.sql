IF EXISTS (SELECT * FROM sys.foreign_keys  WHERE object_id = OBJECT_ID(N'FK_TreatmentReadingPatient_Patient') AND parent_object_id = OBJECT_ID(N'dbo.TreatmentReading'))
  BEGIN
ALTER TABLE [dbo].TreatmentReading DROP CONSTRAINT FK_TreatmentReadingPatient_Patient;
  END
GO

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Patient]') AND type in (N'U'))
DROP TABLE [dbo].[Patient]
GO

/****** Object:  Table [dbo].[Patient]    Script Date: 5/22/2021 11:50:31 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Patient](
[PatientId] [int] IDENTITY(1,1) NOT NULL,
Age int  NOT NULL check (Age between 20 and 100),
Gender Varchar (10) check (Gender in ('Female','Male'))
 CONSTRAINT [PK_Patient] PRIMARY KEY CLUSTERED
(
[PatientId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO





IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TreatmentReading]') AND type in (N'U'))
DROP TABLE [dbo].[TreatmentReading]
GO




/****** Object:  Table [dbo].[TreatmentReading]    Script Date: 5/22/2021 11:50:31 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[TreatmentReading](
[TreatmentReadingId] [int] IDENTITY(1,1) NOT NULL,
VisitWeek int  NOT NULL,
Reading decimal (10,2) NULL,
PatientId int NULL
 CONSTRAINT [PK_TreatmentReading] PRIMARY KEY CLUSTERED
(
[TreatmentReadingId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO


ALTER TABLE [dbo].[TreatmentReading]  WITH CHECK ADD  CONSTRAINT [FK_TreatmentReadingPatient_Patient] FOREIGN KEY([PatientId])
REFERENCES [dbo].[Patient] ([PatientId])
GO

/****** Object:  StoredProcedure [dbo].[PatientSet]    Script Date: 05/22/2021 13:56:09 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PatientSet]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[PatientSet]
GO


/****** Object:  UserDefinedTableType [dbo].[PatientTableType]    Script Date: 05/22/2021 13:47:55 ******/
IF  EXISTS (SELECT * FROM sys.types st JOIN sys.schemas ss ON st.schema_id = ss.schema_id WHERE st.name = N'PatientTableType' AND ss.name = N'dbo')
DROP TYPE [dbo].[PatientTableType]
GO

/****** Object:  UserDefinedTableType [dbo].[PatientTableType]    Script Date: 05/22/2021 13:47:55 ******/
CREATE TYPE [dbo].[PatientTableType] AS TABLE(
	[PatientId] [int] NOT NULL,
	[Age] [int] NOT NULL,
	[Gender] [varchar](10) NULL
)
GO



/****** Object:  UserDefinedTableType [dbo].[TreatmentReadingTableType]    Script Date: 05/22/2021 13:46:14 ******/
IF  EXISTS (SELECT * FROM sys.types st JOIN sys.schemas ss ON st.schema_id = ss.schema_id WHERE st.name = N'TreatmentReadingTableType' AND ss.name = N'dbo')
DROP TYPE [dbo].[TreatmentReadingTableType]
GO


/****** Object:  UserDefinedTableType [dbo].[TreatmentReadingTableType]    Script Date: 05/22/2021 13:46:14 ******/
CREATE TYPE [dbo].[TreatmentReadingTableType] AS TABLE(
	[TreatmentReadingId] [int] NOT NULL,
	[VisitWeek] [int] NOT NULL,
	[Reading] [decimal](10, 2) NULL,
	[PatientId] [int] NULL
)
GO




--+++++++++++=======================++++++++++++++++++

--Stored Procedures----






/****** Object:  StoredProcedure [dbo].[PatientSet]    Script Date: 05/22/2021 13:56:09 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[PatientSet] @Patients AS PatientTableType READONLY
AS

INSERT INTO dbo.Patient(Age,Gender)

SELECT p.Age,p.Gender FROM @Patients p;

 SELECT DISTINCT Patient.PatientId FROM INSERTED;

GO

--IF  EXISTS (SELECT * FROM sys.types st JOIN sys.schemas ss ON st.schema_id = ss.schema_id WHERE st.name = N'PatientIDs' AND ss.name = N'dbo')
--DROP TYPE [dbo].PatientIDs
--GO


--CREATE TYPE PatientIDs AS TABLE
--(
--    PatientId INT
--);

CREATE TRIGGER PatientInsertTrigger ON Patient FOR INSERT
AS
    BEGIN
        DECLARE @PatientIDs PatientIDs;
        INSERT INTO @PatientIDs(PatientID)
            SELECT DISTINCT PatientID FROM INSERTED;
        EXEC PatientInsertTrigger @PatientIDs;
    END;
