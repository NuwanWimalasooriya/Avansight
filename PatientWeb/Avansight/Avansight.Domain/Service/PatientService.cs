using Avansight.Domain.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace Avansight.Domain.Service
{
  public  class PatientService:IPatientService
    {
        DataAccessService _dataAccessService;

        public PatientService(DataAccessService dataAccessService)
        {
            _dataAccessService = dataAccessService;
        }

       public int InsertPatients(List<Patient> patients)
        {
            return _dataAccessService.InsertPatients(patients);
        }

       public List<Patient> GetPatients()
        {
            return _dataAccessService.GetPatients();
        }

      public  int InsertTreatmentReadings(List<TreatmentReading> treatmentReadings)
        {
            return _dataAccessService.InsertTreatmentReadings(treatmentReadings);
        }

       public List<TreatmentReading> GetTreatmentReadings()
        {
            return _dataAccessService.GetTreatmentReadings();
        }
    }
}
