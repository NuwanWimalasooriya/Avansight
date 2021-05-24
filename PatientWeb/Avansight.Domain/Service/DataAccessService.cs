using Avansight.Domain.Model;
using Dapper;
using DapperParameters;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Transactions;

namespace Avansight.Domain.Service
{
    public class DataAccessService : IDataAccessService
    {
        private readonly IConfiguration Configuration;
        private readonly string ConnectionString;

        public DataAccessService(IConfiguration _configuration)
        {
            Configuration = _configuration;
            ConnectionString = Configuration.GetConnectionString("PatientDB");
        }
        public List<int> InsertPatients(List<Patient> patients)
        {
            List<int> patientIDs = new List<int>();
            using (IDbConnection connection = new SqlConnection(ConnectionString))
            {
                if (connection.State == ConnectionState.Closed)
                    connection.Open();

                var parameters = new DynamicParameters();
                parameters.AddTable("@Patients", "PatientTableType", patients);

                var results = connection.Query("PatientSet", parameters, commandType: CommandType.StoredProcedure).ToList();

                foreach (var row in results)
                {
                    patientIDs.Add(row.PatientId);
                }
            }

            return patientIDs;

        }

        public List<Patient> GetPatients()
        {
            var patientList = new List<Patient>();

            using (IDbConnection connection = new SqlConnection(ConnectionString))
            {
                if (connection.State == ConnectionState.Closed)
                    connection.Open();

                patientList = connection.Query<Patient>("PatientGet").ToList();

            }

            return patientList;
        }

        public int InsertTreatmentReadings(List<TreatmentReading> treatmentReadings)
        {
            var rowCount = 0;
            using (IDbConnection connection = new SqlConnection(ConnectionString))
            {
                if (connection.State == ConnectionState.Closed)
                    connection.Open();

                var parameters = new DynamicParameters();
                parameters.AddTable("@TreatmentReadings", "TreatmentReadingTableType", treatmentReadings);


                rowCount = connection.Execute("TreatmentReadingSet", parameters, commandType: CommandType.StoredProcedure);
            }

            return rowCount;

        }

        public List<TreatmentReading> GetTreatmentReadings()
        {
            var treatmentReadingList = new List<TreatmentReading>();

            using (IDbConnection connection = new SqlConnection(ConnectionString))
            {
                if (connection.State == ConnectionState.Closed)
                    connection.Open();

                treatmentReadingList = connection.Query<TreatmentReading>("TreatmentReadingGet").ToList();

            }

            return treatmentReadingList;
        }

        public int DeletePatientAndTreatments(int PatientId)
        {
            var affectedRows = 0;
            using (IDbConnection connection = new SqlConnection(ConnectionString))
            {
                if (connection.State == ConnectionState.Closed)
                    connection.Open();


                affectedRows = connection.Execute("DeletePatientAndTreatments", new { PatientId = PatientId }, commandType: CommandType.StoredProcedure);
            }

            return affectedRows;

        }

        public int UpdateTreatmentReadings(List<TreatmentReading> readings, List<Patient> patients)
        {
            var rowsAffected = 0;
            readings = new List<TreatmentReading>();
            using (var conn = new SqlConnection(ConnectionString))
            {
                conn.Open();

                using (SqlTransaction tran = conn.BeginTransaction())
                {
                    try
                    { 
                         var patientIdList=   InsertPatients(patients);
                        int minPatientId = patientIdList.Min(a => a);
                        DeletePatientAndTreatments(minPatientId);
                        foreach (var pId in patientIdList)
                        {
                            readings= GenerateTreatments(pId);
                            rowsAffected = InsertTreatmentReadings(readings);
                        }
                            tran.Commit();
                    }
                    catch (Exception ex)
                    {
                        tran.Rollback();

                        throw ex;
                    }
                }
            }

            return rowsAffected;
        }

        private List<TreatmentReading> GenerateTreatments(int patientId)
        {
            var readingList = new List<TreatmentReading>();
            Random rand = new Random();
            string[] visitWeekData = { "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10", };

                int index = rand.Next(1, visitWeekData.Length);

                var newRandomvisitWeekData = visitWeekData.SubArray(0, index);
                foreach (var value in newRandomvisitWeekData)
                {
                    int randomInt = rand.Next(0, 10);
                    double randomDouble = rand.Next(0, 999999999);
                    decimal randomDec = Convert.ToDecimal(randomInt) + Convert.ToDecimal((randomDouble / 1000000000));

                    var reading = new TreatmentReading()
                    {
                        PatientId = patientId,
                        Reading = Convert.ToDecimal(randomDec.ToString("#.####")),
                        VisitWeek = value
                    };

                    readingList.Add(reading);
                }

            return readingList;
        }


    }
}
