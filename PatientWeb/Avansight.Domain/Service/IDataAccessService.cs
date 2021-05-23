using Avansight.Domain.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace Avansight.Domain.Service
{
    public interface IDataAccessService
    {
        List<int> InsertPatients(List<Patient> patients);

        List<Patient> GetPatients();

       int  InsertTreatmentReadings(List<TreatmentReading> treatmentReadings);

        List<TreatmentReading> GetTreatmentReadings();
    }
}
