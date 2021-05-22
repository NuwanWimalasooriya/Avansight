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

        public int UpdateTreatmentReadings(List<TreatmentReading> readings, List<int> patientIds)
        {
            var rowsAffected = 0;
           
            using (var conn = new SqlConnection(ConnectionString))
            {
                conn.Open();

                using (SqlTransaction tran = conn.BeginTransaction())
                {
                    try
                    {
                      int minPatientId  =patientIds.Min(a => a);
                        DeletePatientAndTreatments(minPatientId);
                        rowsAffected= InsertTreatmentReadings(readings);
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


    }
}
