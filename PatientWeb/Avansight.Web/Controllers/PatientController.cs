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
        private readonly IPatientService _patientService;
        public PatientController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        public IActionResult Index()
        {
            var sm = new SimulatePatientVM();
            var pc = new PatientChart();
            var patientModel = new PatientViewModel() { SimulatePatientVM = sm, PatientChart = pc };
            return View(patientModel);
        }

        public IActionResult CreatePatients()
        {
            return View();
        }

        [HttpPost]
        public IActionResult CreatePatients(SimulatePatientVM simulatePatientVM)
        {
            var patientList = PatientGenerateService.GeneratePatintList(simulatePatientVM);
            //var patientIdList = _patientService.InsertPatients(patientList);
           // HttpContext.Session.SetComplexData("patientIdList", patientIdList);
            HttpContext.Session.SetComplexData("patientList", patientList);
            return Ok(patientList.Count);
        }



        public IActionResult GetPatients()
        {
           // var patient = _patientService.GetPatients();
            var patient = HttpContext.Session.GetComplexData<List<Patient>>("patientList");
            if (patient != null)
            {
                var patientFormatted = patient.GroupBy(g => new { g.Age, g.Gender }).Select(s => new { s.Key.Age, s.Key.Gender, PatientCount = s.Count() });

                var arrayOfPatients = patientFormatted.ToList().Select(s =>
                            new ArrayList() { s.Gender, s.Age, s.PatientCount }
                            );

            return Ok(arrayOfPatients);
            }
            return Ok(new ArrayList());
        }

        [HttpPost]
        public IActionResult CreateTreatmentReadings()
        {
           // var patientIdList = HttpContext.Session.GetComplexData<List<int>>("patientIdList");
            var patientList = HttpContext.Session.GetComplexData<List<Patient>>("patientList");
            var readingRecords = new List<TreatmentReading>();
            var affectedReadings = 0;

            //if (patientIdList != null)
            //{
            //    var readingList = PatientGenerateService.GenerateReadingRecords(patientIdList);
            //    // affectedReadings = _patientService.InsertTreatmentReadings(readingList);
            //     affectedReadings = _patientService.UpdateTreatmentReadings(readingList, patientIdList);
            //}

            if (patientList != null)
            {
                var readingList = new List<TreatmentReading>();//PatientGenerateService.GenerateReadingRecords(patientList);
                // affectedReadings = _patientService.InsertTreatmentReadings(readingList);
                affectedReadings = _patientService.UpdateTreatmentReadings(readingList, patientList);
            }

            return Ok(affectedReadings);
        }

        public IActionResult GetTreatmentReadings()
        {
            var readingRecords = _patientService.GetTreatmentReadings();

            var readingsFormatted = readingRecords.GroupBy(g => new { g.PatientId, g.VisitWeek,g.Reading }).Select(s => new { s.Key.PatientId, s.Key.VisitWeek,s.Key.Reading, ReadingCount = s.Count() });

            var arrayOfReadings = readingsFormatted.ToList().Select(s =>
                         new ArrayList() { s.PatientId, s.VisitWeek, s.Reading , s.ReadingCount }
                         );
            return Ok(arrayOfReadings);
        }


    }
}
