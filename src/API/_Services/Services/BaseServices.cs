using API._Repositories;

namespace API._Services.Services
{
    public class BaseServices(IRepositoryAccessor repoStore)
    {
        protected readonly IRepositoryAccessor _repoStore = repoStore;
    }
}