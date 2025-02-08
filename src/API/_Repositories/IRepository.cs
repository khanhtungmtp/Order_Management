using System.Linq.Expressions;
using static API.Configurations.DependencyInjectionConfig;

namespace API._Repositories;

[DependencyInjection(ServiceLifetime.Scoped)]
public interface IRepository<T> where T : class
{
    Task<T> FindByIdAsync(object id);
    // Returns:
    //     The query results.
    Task<T> FindAsync(params object[] keyValues);

    IQueryable<T> FindAll(bool? noTracking = false);

    IQueryable<T> FindAll(Expression<Func<T, bool>> predicate, bool? noTracking = false);

    void Add(T entity);
    Task AddAsync(T entity);
    void AddMany(IEnumerable<T> entities);
    Task AddManyAsync(IEnumerable<T> entities);
    void Update(T entity);
    void UpdateMany(List<T> entities);
    void Remove(T entity);

    void Remove(object id);
    void RemoveMany(IEnumerable<T> entities);
    bool All(Expression<Func<T, bool>> predicate);

    Task<bool> AllAsync(Expression<Func<T, bool>> predicate);

    bool Any();
    bool Any(Expression<Func<T, bool>> predicate);

    Task<bool> AnyAsync();
    Task<bool> AnyAsync(Expression<Func<T, bool>> predicate);

    T FirstOrDefault(bool? noTracking = false);
    T FirstOrDefault(Expression<Func<T, bool>> predicate, bool? noTracking = false);

    Task<T> FirstOrDefaultAsync(bool? noTracking = false);
    Task<T> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate, bool? noTracking = false);

    int Count();
    int Count(Expression<Func<T, bool>> predicate);

    Task<int> CountAsync();
    Task<int> CountAsync(Expression<Func<T, bool>> predicate);

    T LastOrDefault(bool? noTracking = false);
    T LastOrDefault(Expression<Func<T, bool>> predicate, bool? noTracking = false);

    Task<T> LastOrDefaultAsync(bool? noTracking = false);
    Task<T> LastOrDefaultAsync(Expression<Func<T, bool>> predicate, bool? noTracking = false);

    decimal Sum(Expression<Func<T, decimal>> selector);
    decimal? Sum(Expression<Func<T, decimal?>> selector);
    decimal Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, decimal>> selector);
    decimal? Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, decimal?>> selector);

    Task<decimal> SumAsync(Expression<Func<T, decimal>> selector);
    Task<decimal?> SumAsync(Expression<Func<T, decimal?>> selector);
    Task<decimal> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, decimal>> selector);
    Task<decimal?> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, decimal?>> selector);

    int Sum(Expression<Func<T, int>> selector);
    int? Sum(Expression<Func<T, int?>> selector);
    int Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, int>> selector);
    int? Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, int?>> selector);

    Task<int> SumAsync(Expression<Func<T, int>> selector);
    Task<int?> SumAsync(Expression<Func<T, int?>> selector);
    Task<int> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, int>> selector);
    Task<int?> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, int?>> selector);

    long Sum(Expression<Func<T, long>> selector);
    long? Sum(Expression<Func<T, long?>> selector);
    long Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, long>> selector);
    long? Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, long?>> selector);

    Task<long> SumAsync(Expression<Func<T, long>> selector);
    Task<long?> SumAsync(Expression<Func<T, long?>> selector);
    Task<long> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, long>> selector);
    Task<long?> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, long?>> selector);

    float Sum(Expression<Func<T, float>> selector);
    float? Sum(Expression<Func<T, float?>> selector);
    float Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, float>> selector);
    float? Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, float?>> selector);

    Task<float> SumAsync(Expression<Func<T, float>> selector);
    Task<float?> SumAsync(Expression<Func<T, float?>> selector);
    Task<float> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, float>> selector);
    Task<float?> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, float?>> selector);
}
