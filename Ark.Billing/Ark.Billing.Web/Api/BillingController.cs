using Microsoft.AspNetCore.Mvc;

namespace Ark.Billing.Web.Api
{
    [Route("{customer}")]
    public class BillingController : ControllerBase
    {
        [HttpPost]
        [Route("template/save/{templ_name}")]
        public async Task<dynamic> PostTemplate([FromForm] string template, [FromRoute] string customer, [FromRoute] string templ_name)
        {

            //var str = System.Text.Json.JsonSerializer.Serialize(template);
            await Console.Out.WriteLineAsync(template);
            System.IO.File.WriteAllText(System.IO.Path.Combine(System.Environment.CurrentDirectory, "Data", customer, "template", templ_name + "_.json"), template);
            return new
            {
                template = template,
                files = Request.Form.Files.Count,
                customer = customer
            };
        }
    }
}
