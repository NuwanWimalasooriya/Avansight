use PatientDB;

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
VisitWeek Varchar (10) check (VisitWeek in ('V1','V2','V3','V4','V5','V6','V7','V8','V9','V10')),
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

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TreatmentReadingSet]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[TreatmentReadingSet]
GO
/****** Object:  UserDefinedTableType [dbo].[PatientTableType]    Script Date: 05/22/2021 13:47:55 ******/
IF  EXISTS (SELECT * FROM sys.types st JOIN sys.schemas ss ON st.schema_id = ss.schema_id WHERE st.name = N'PatientTableType' AND ss.name = N'dbo')
DROP TYPE [dbo].[PatientTableType]
GO

/****** Object:  UserDefinedTableType [dbo].[PatientTableType]    Script Date: 05/22/2021 13:47:55 ******/
CREATE TYPE [dbo].[PatientTableType] AS TABLE(
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
	[VisitWeek] varchar(10) NULL,
	[Reading] [decimal](10, 2) NULL,
	[PatientId] [int] NULL
)
GO




--+++++++++++=======================++++++++++++++++++

--Stored Procedures----



IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PatientSet]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[PatientSet]
GO


/****** Object:  StoredProcedure [dbo].[PatientSet]    Script Date: 05/22/2021 13:56:09 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


create PROCEDURE [dbo].[PatientSet]
    @Patients [dbo].PatientTableType READONLY
AS
create table #Temp (PatientId int);
MERGE [dbo].Patient AS target
USING (SELECT
     age, gender
    FROM @Patients) AS source ON 0 = 1 --unconditional inserts
WHEN NOT MATCHED THEN 
    INSERT (
       Age, gender
        )
    VALUES (
        source.Age
        , source.Gender
    )
OUTPUT
        inserted.PatientId 
      
      INTO #Temp;
      select PatientId from #Temp;
       Drop Table #Temp
GO


--GO
--CREATE TRIGGER PatientInsertTrigger ON Patient FOR INSERT
--AS
--    BEGIN
--        DECLARE @Patients PatientTableType;
--            SELECT DISTINCT PatientID FROM INSERTED;
--        EXEC PatientSet @Patients;
--    END;
--GO

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PatientGet]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[PatientGet]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[PatientGet] 
AS

SELECT * FROM [dbo].[Patient]


GO



IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TreatmentReadingSet]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[TreatmentReadingSet]
GO


/****** Object:  StoredProcedure [dbo].[TreatmentReadingSet]    Script Date: 05/22/2021 13:56:09 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


create PROCEDURE [dbo].[TreatmentReadingSet]  @TreatmentReadings AS TreatmentReadingTableType READONLY
AS

INSERT INTO dbo.TreatmentReading(PatientId, VisitWeek,Reading)

SELECT tr.PatientId,tr.VisitWeek, tr.Reading FROM @TreatmentReadings tr;



GO

GO

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TreatmentReadingGet]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[TreatmentReadingGet]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[TreatmentReadingGet] 
AS

SELECT * FROM [dbo].[TreatmentReading]


GO

GO

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DeletePatientAndTreatments]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[DeletePatientAndTreatments]
GO
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE DeletePatientAndTreatments
(
 @PatientId int
)

AS 
        BEGIN
            DELETE from [dbo].[TreatmentReading]  
            Where PatientId < @PatientId;
            
             DELETE from [dbo].[Patient]  
            Where PatientId < @PatientId;
        END