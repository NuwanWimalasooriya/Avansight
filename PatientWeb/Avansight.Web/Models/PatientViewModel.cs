using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Avansight.Web.Models
{
    public class PatientViewModel
    {
      public  SimulatePatientVM SimulatePatientVM { get; set; }


        public PatientChart PatientChart { get; set; }
    }
}
