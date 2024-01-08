using Ark.Billing.Web.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace Ark.Billing.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult InvoiceT()
        {
            ViewBag.currency = "₹";
            return View();
        }
        public IActionResult Invoice()
        {
            ViewBag.currency = "₹";
            return View();
        }

        public IActionResult InvoiceMulti()
        {
            ViewBag.currency = "₹";
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }
        public IActionResult RenderInvoice()
        {
            return View();
        }

        public IActionResult Ama()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}