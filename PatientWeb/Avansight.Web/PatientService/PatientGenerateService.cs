using Avansight.Domain.Model;
using Avansight.Web.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Avansight.Web.PatientService
{
   public static class PatientGenerateService
    {
        public  static List<Patient> GeneratePatintList(SimulatePatientVM simulatePatientVM)
        {
            List<Patient> patients = new List<Patient>();
            var maleWeight = Convert.ToUInt32(((double)simulatePatientVM.MaleWeight / (double)(simulatePatientVM.MaleWeight + simulatePatientVM.FemaleWeight)) * simulatePatientVM.SampleSize);
            var femaleWeight = simulatePatientVM.SampleSize - maleWeight;

            var totalAgeSampleWeight = simulatePatientVM.AgeGroup2030 + simulatePatientVM.AgeGroup3040 + simulatePatientVM.AgeGroup4050 + simulatePatientVM.AgeGroup5060 + simulatePatientVM.AgeGroup6070;
            var male2030Weight = Convert.ToUInt32(((double)simulatePatientVM.AgeGroup2030 / (double)(totalAgeSampleWeight)) * maleWeight);
            var male3040Weight = Convert.ToUInt32(((double)simulatePatientVM.AgeGroup3040 / (double)(totalAgeSampleWeight)) * maleWeight);
            var male4050Weight = Convert.ToUInt32(((double)simulatePatientVM.AgeGroup4050 / (double)(totalAgeSampleWeight)) * maleWeight);
            var male5060Weight = Convert.ToUInt32(((double)simulatePatientVM.AgeGroup5060 / (double)(totalAgeSampleWeight)) * maleWeight);
            var male6070Weight = Convert.ToUInt32(((double)simulatePatientVM.AgeGroup6070 / (double)(totalAgeSampleWeight)) * maleWeight);

            var female2030Weight = Convert.ToUInt32(((double)simulatePatientVM.AgeGroup2030 / (double)(totalAgeSampleWeight)) * femaleWeight);
            var female3040Weight = Convert.ToUInt32(((double)simulatePatientVM.AgeGroup3040 / (double)(totalAgeSampleWeight)) * femaleWeight);
            var female4050Weight = Convert.ToUInt32(((double)simulatePatientVM.AgeGroup4050 / (double)(totalAgeSampleWeight)) * femaleWeight);
            var female5060Weight = Convert.ToUInt32(((double)simulatePatientVM.AgeGroup5060 / (double)(totalAgeSampleWeight)) * femaleWeight);
            var female6070Weight = Convert.ToUInt32(((double)simulatePatientVM.AgeGroup6070 / (double)(totalAgeSampleWeight)) * femaleWeight);

            GenerateMalePatients(patients, male2030Weight, "AgeGroup2030");
            GenerateMalePatients(patients, male3040Weight, "AgeGroup3040");
            GenerateMalePatients(patients, male4050Weight, "AgeGroup4050");
            GenerateMalePatients(patients, male5060Weight, "AgeGroup5060");
            GenerateMalePatients(patients, male6070Weight, "AgeGroup6070");

            GenerateFemalePatients(patients, female2030Weight, "AgeGroup2030");
            GenerateFemalePatients(patients, female3040Weight, "AgeGroup3040");
            GenerateFemalePatients(patients, female4050Weight, "AgeGroup4050");
            GenerateFemalePatients(patients, female5060Weight, "AgeGroup5060");
            GenerateFemalePatients(patients, female6070Weight, "AgeGroup6070");

            return patients;

        }

        public static List<TreatmentReading> GenerateReadingRecords(List<Patient> patientList)
        {
            var readingList = new List<TreatmentReading>();
            Random rand = new Random();
            string[] visitWeekData = { "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10", };
          
            foreach (var patient in patientList)
            {
                int index = rand.Next(1, visitWeekData.Length);

                var newRandomvisitWeekData = visitWeekData.SubArray(0, index);
                foreach (var value in newRandomvisitWeekData)
                {
                    int randomInt = rand.Next(0, 10);
                    double randomDouble = rand.Next(0, 999999999);
                    decimal randomDec = Convert.ToDecimal(randomInt) + Convert.ToDecimal((randomDouble / 1000000000));

                    var reading = new TreatmentReading()
                    {
                        PatientId = 0,
                        Reading = Convert.ToDecimal(randomDec.ToString("#.####")),
                        VisitWeek = value
                    };

                    readingList.Add(reading);
                }
            }

            return readingList;
        }

        private static void GenerateMalePatients(List<Patient> patients, uint maleAgeWeight, string ageText)
        {
            for (int i = 0; i < maleAgeWeight; i++)
            {
                var patient = new Patient()
                {
                    Age = CalculateAge(ageText),
                    Gender = "Male"
                };
                patients.Add(patient);

            }
        }

        private static void GenerateFemalePatients(List<Patient> patients, uint femaleAgeWeight, string ageText)
        {
            for (int i = 0; i < femaleAgeWeight; i++)
            {
                var patient = new Patient()
                {
                    Age = CalculateAge(ageText),
                    Gender = "Female"
                };
                patients.Add(patient);

            }
        }

        private static int CalculateAge(string ageText)
        {
            Random r = new Random();
            int age = 0;
            age = r.Next(GetMapping(ageText).Item1, GetMapping(ageText).Item2);

            return age;
        }


        private static Tuple<int, int> GetMapping(string ageText)
        {
            switch (ageText)
            {
                case "AgeGroup2030":
                    return new Tuple<int, int>(21, 30);
                case "AgeGroup3040":
                    return new Tuple<int, int>(31, 40);
                case "AgeGroup4050":
                    return new Tuple<int, int>(41, 50);
                case "AgeGroup5060":
                    return new Tuple<int, int>(51, 60);
                case "AgeGroup6070":
                    return new Tuple<int, int>(61, 70);
                default:
                    return new Tuple<int, int>(0, 0);
            }
        }

    }
}
