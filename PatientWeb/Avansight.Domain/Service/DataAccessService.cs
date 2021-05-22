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
        public int InsertPatients(List<Patient> patients)
        {
            int rowAffected = 0;
            using (IDbConnection connection = new SqlConnection(ConnectionString))
            {
                if (connection.State == ConnectionState.Closed)
                    connection.Open();

                var parameters = new DynamicParameters();
                parameters.AddTable("@Patients", "PatientTableType", patients);


                rowAffected = connection.Execute("PatientSet", parameters, commandType: CommandType.StoredProcedure);

            }

            return rowAffected;

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
            int rowCount = 0;
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


    }
}
