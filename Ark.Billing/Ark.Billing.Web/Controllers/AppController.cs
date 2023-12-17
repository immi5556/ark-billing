using Microsoft.AspNetCore.Mvc;
using System.Dynamic;

namespace Ark.Billing.Web.Controllers
{
    [Route("{customer}")]
    public class AppController : Controller
    {
        [HttpGet]
        [Route("templates")]
        public IActionResult Index([FromRoute] string customer)
        {
            var files = new List<dynamic>();
            foreach (var file in System.IO.Directory.EnumerateFiles(System.IO.Path.Combine(Environment.CurrentDirectory, "Data", customer, "template")))
            {
                files.Add(new
                {
                    file_name = System.IO.Path.GetFileNameWithoutExtension(file)
                });
            }
            ViewBag.customer = customer;
            ViewBag.files = files;
            return View();
        }
        [HttpGet]
        [Route("render/{template_name}")]
        public IActionResult Render([FromRoute] string customer, [FromRoute] string template_name)
        {
            var fll = System.IO.File.ReadAllText(System.IO.Path.Combine(Environment.CurrentDirectory, "Data", customer, "template", template_name + ".json"));
            ViewBag.template = System.Text.Json.JsonSerializer.Deserialize<ExpandoObject>(fll);
            return View();
        }
    }
}
