using PromomashTask.Services.Model;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PromomashTask.Services
{
    class InMemoryAddressProvider : IAddressProvider
    {
        private Country[] countries_ = new Country[]
        {
                new Country { Code = "AO", Title = "Angola", Provinces = new [] { "Bengo", "Cabinda", "Luanda", "Zaire" }},
                new Country { Code = "AR", Title = "Argentina", Provinces = new [] { "Buenos Aires", "Chaco", "La Pampa", "Santa Fe" }},
                new Country { Code = "CA", Title = "Canada", Provinces = new [] { "Alberta", "Nova Scotia", "Ontario", "Quebec" }},
                new Country { Code = "EC", Title = "Ecuador", Provinces = new [] { "Azuay", "Loja", "Pichincha" } }
        };

        public Task<IEnumerable<Country>> GetCountriesAsync()
        {
            return Task.FromResult<IEnumerable<Country>>(countries_);
        }

        public Task<IEnumerable<string>> GetProvincesAsync(string countryCode)
        {
            var country = countries_.FirstOrDefault(c => c.Code == countryCode.ToUpper());
            return Task.FromResult<IEnumerable<string>>( country?.Provinces ?? new string[]{});
        }
    }
}
