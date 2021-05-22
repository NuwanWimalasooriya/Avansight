using Avansight.Domain.Model;
using Avansight.Domain.Service;
using System;
using System.Collections.Generic;

namespace Avansight.BL
{
    public class PatientService : IPatientService
    {
        IDataAccessService _dataAccessService;

        public PatientService(IDataAccessService dataAccessService)
        {
            _dataAccessService = dataAccessService;
        }

        public List<int> InsertPatients(List<Patient> patients)
        {
            return _dataAccessService.InsertPatients(patients);
        }

        public List<Patient> GetPatients()
        {
            return _dataAccessService.GetPatients();
        }

        public int InsertTreatmentReadings(List<TreatmentReading> treatmentReadings)
        {
            return _dataAccessService.InsertTreatmentReadings(treatmentReadings);
        }

        public List<TreatmentReading> GetTreatmentReadings()
        {
            return _dataAccessService.GetTreatmentReadings();
        }

        public int UpdateTreatmentReadings(List<TreatmentReading> readings, List<int> patientIds)
        {
          return  _dataAccessService.UpdateTreatmentReadings(readings, patientIds);
        }

    }
}
