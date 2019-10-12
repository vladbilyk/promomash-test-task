using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PromomashTask.Services.Model;
using System.Linq;
using System.Threading.Tasks;

namespace PromomashTask.Api.Controllers
{
    public class AddressDataController : Controller
    {
        private IAddressProvider CountriesProvider { get; }
        private ILogger Logger { get; }

        public AddressDataController(IAddressProvider countriesProvider, ILogger<AddressDataController> logger)
        {
            CountriesProvider = countriesProvider;
            Logger = logger;
        }

        [HttpGet("api/countries")]
        public async Task<IActionResult> GetCountriesAsync()
        {
            Logger.LogDebug("Countries were requested");

            var countries = await CountriesProvider?.GetCountriesAsync();
            return Ok((countries ?? new Country[] {})
                .Select(c => new CountryDto { Code = c.Code, Title = c.Title }).ToArray());
        }

        [HttpGet("api/countries/{countryCode}/provinces")]
        public async Task<IActionResult> GetProvinces(string countryCode)
        {
            Logger.LogDebug($"Provinces for country {countryCode} were requested");
            var provinces = await CountriesProvider?.GetProvincesAsync(countryCode);
            return Ok(provinces ?? new string[] { });
        }
    }
}
