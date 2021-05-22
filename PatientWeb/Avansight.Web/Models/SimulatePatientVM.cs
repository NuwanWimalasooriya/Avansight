using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Avansight.Web.Models
{
    public class SimulatePatientVM
    {
        public int SampleSize { get; set; }
        public int MaleWeight { get; set; }
        public int FemaleWeight { get; set; }
        public int AgeGroup2030 { get; set; }
        public int AgeGroup3040 { get; set; }
        public int AgeGroup4050 { get; set; }
        public int AgeGroup5060 { get; set; }
        public int AgeGroup6070 { get; set; }
    }
}
