using System.Collections.Generic;
using System.Threading.Tasks;

namespace PromomashTask.Services.Model
{
    public interface IAddressProvider
    {
        Task<IEnumerable<Country>> GetCountriesAsync();

        Task<IEnumerable<string>> GetProvincesAsync(string countryCode);
    }
}