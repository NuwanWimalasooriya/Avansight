using Avansight.BL;
using Avansight.Domain.Model;
using Avansight.Domain.Service;
using Avansight.Web.Models;
using Avansight.Web.PatientService;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Avansight.Web.Controllers
{
    public class PatientController : Controller
    {
        private readonly IDataAccessService _patientService;
        public PatientController(IDataAccessService patientService)
        {
            _patientService = patientService;
        }

        public IActionResult Index()
        {
            var sm = new SimulatePatientVM();
            var pc = new PatientChart();
            var patientModel = new PatientViewModel() { SimulatePatientVM = sm ,PatientChart=pc};
            return View(patientModel);
        }

        public IActionResult CreatePatients()
        {
            return View();
        }

        [HttpPost]
        public IActionResult CreatePatients(SimulatePatientVM simulatePatientVM)
        {
            var patientList= PatientGenerateService.GeneratePatintList(simulatePatientVM);
            _patientService.InsertPatients(patientList);

            return Ok(1);
        }

       

        public IActionResult GetPatients()
        {
            var patient = _patientService.GetPatients();
            var patientFormatted = patient.GroupBy(g => new { g.Age, g.Gender }).Select(s => new { s.Key.Age, s.Key.Gender, PatientCount = s.Count() });

            var arrayOfPatients = patientFormatted.ToList().Select(s =>
                        new ArrayList() { s.Gender, s.Age, s.PatientCount }
                        );

            return Ok(arrayOfPatients);
        }


    }
}
