using System;
using System.Collections.Generic;
using System.Text;

namespace Avansight.Domain.Model
{
   public class TreatmentReading
    {

        public string VisitWeek { get; set; }
        public decimal Reading { get; set; }
        public int PatientId { get; set; }
        
    }
}
