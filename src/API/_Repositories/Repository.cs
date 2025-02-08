using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace API._Repositories;

public class Repository<T, DBContext> : IRepository<T> where T : class where DBContext : DbContext
{
    private readonly DBContext _context;
    private readonly DbSet<T> _dbSet;
    public Repository(DBContext context)
    {
        _context = context;
        _dbSet = _context.Set<T>();
    }

    public void Add(T entity)
    {
        _dbSet.Add(entity);
    }

    public async Task AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
    }

    public void AddMany(IEnumerable<T> entities)
    {
        _dbSet.AddRange(entities);
    }

    public async Task AddManyAsync(IEnumerable<T> entities)
    {
        await _context.Set<T>().AddRangeAsync(entities);
    }

    public IQueryable<T> FindAll(bool? noTracking = false)
    {
        return noTracking == true ? _dbSet.AsNoTracking() : _dbSet;
    }

    public IQueryable<T> FindAll(Expression<Func<T, bool>> predicate, bool? noTracking = false)
    {
        return noTracking == true ? _dbSet.Where(predicate).AsNoTracking() : _dbSet.Where(predicate);
    }

    public async Task<T> FindByIdAsync(object id)
    {
        return await _dbSet.FindAsync(id) ?? null!;
    }

    public async Task<T> FindAsync(params object[] keyValues)
    {
        return await _dbSet.FindAsync(keyValues) ?? null!;
    }

    public void Remove(T entity)
    {
        _dbSet.Remove(entity);
    }

    public void Remove(object id)
    {
        Remove(FindByIdAsync(id));
    }

    public void RemoveMany(IEnumerable<T> entities)
    {
        _dbSet.RemoveRange(entities);
    }

    public void Update(T entity)
    {
        _dbSet.Update(entity);
    }

    public void UpdateMany(List<T> entities)
    {
        _dbSet.UpdateRange(entities);
    }

    public bool All(Expression<Func<T, bool>> predicate)
    {
        return _dbSet.All(predicate);
    }

    public async Task<bool> AllAsync(Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.AllAsync(predicate);
    }

    public bool Any()
    {
        return _dbSet.Any();
    }

    public bool Any(Expression<Func<T, bool>> predicate)
    {
        return _dbSet.Any(predicate);
    }

    public async Task<bool> AnyAsync()
    {
        return await _dbSet.AnyAsync();
    }

    public async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.AnyAsync(predicate);
    }

    public T FirstOrDefault(bool? noTracking = false)
    {
        return noTracking == true ? _dbSet.AsNoTracking().FirstOrDefault() ?? default! : _dbSet.FirstOrDefault() ?? default!;
    }

    public T FirstOrDefault(Expression<Func<T, bool>> predicate, bool? noTracking = false)
    {
        return noTracking == true ? _dbSet.AsNoTracking().FirstOrDefault(predicate) ?? default! : _dbSet.FirstOrDefault(predicate) ?? default!;
    }

    public async Task<T> FirstOrDefaultAsync(bool? noTracking = false)
    {
        return noTracking == true ? await _dbSet.AsNoTracking().FirstOrDefaultAsync() ?? default! : await _dbSet.FirstOrDefaultAsync() ?? default!;
    }

    public async Task<T> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate, bool? noTracking = false)
    {
        return noTracking == true ? await _dbSet.AsNoTracking().FirstOrDefaultAsync(predicate) ?? default! : await _dbSet.FirstOrDefaultAsync(predicate) ?? default!;
    }

    public int Count()
    {
        return _dbSet.Count();
    }

    public int Count(Expression<Func<T, bool>> predicate)
    {
        return _dbSet.Count(predicate);
    }

    public async Task<int> CountAsync()
    {
        return await _dbSet.CountAsync();
    }

    public async Task<int> CountAsync(Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.CountAsync(predicate);
    }

    public T LastOrDefault(bool? noTracking = false)
    {
        return noTracking == true ? _dbSet.AsNoTracking().LastOrDefault() ?? default! : _dbSet.LastOrDefault() ?? default!; ;
    }

    public T LastOrDefault(Expression<Func<T, bool>> predicate, bool? noTracking = false)
    {
        return noTracking == true ? _dbSet.AsNoTracking().LastOrDefault(predicate) ?? default! : _dbSet.LastOrDefault(predicate) ?? default!;
    }

    public async Task<T> LastOrDefaultAsync(bool? noTracking = false)
    {
        return noTracking == true ? await _dbSet.AsNoTracking().LastOrDefaultAsync() ?? default! : await _dbSet.LastOrDefaultAsync() ?? default!;
    }

    public async Task<T> LastOrDefaultAsync(Expression<Func<T, bool>> predicate, bool? noTracking = false)
    {
        return noTracking == true ? await _dbSet.AsNoTracking().LastOrDefaultAsync(predicate) ?? default! : await _dbSet.LastOrDefaultAsync(predicate) ?? default!;
    }

    public decimal Sum(Expression<Func<T, decimal>> selector)
    {
        return _dbSet.Sum(selector);
    }

    public decimal? Sum(Expression<Func<T, decimal?>> selector)
    {
        return _dbSet.Sum(selector);
    }

    public decimal Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, decimal>> selector)
    {
        return _dbSet.Where(predicate).Sum(selector);
    }

    public decimal? Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, decimal?>> selector)
    {
        return _dbSet.Where(predicate).Sum(selector);
    }

    public async Task<decimal> SumAsync(Expression<Func<T, decimal>> selector)
    {
        return await _dbSet.SumAsync(selector);
    }

    public async Task<decimal?> SumAsync(Expression<Func<T, decimal?>> selector)
    {
        return await _dbSet.SumAsync(selector);
    }

    public async Task<decimal> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, decimal>> selector)
    {
        return await _dbSet.Where(predicate).SumAsync(selector);
    }

    public async Task<decimal?> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, decimal?>> selector)
    {
        return await _dbSet.Where(predicate).SumAsync(selector);
    }

    public int Sum(Expression<Func<T, int>> selector)
    {
        return _dbSet.Sum(selector);
    }

    public int? Sum(Expression<Func<T, int?>> selector)
    {
        return _dbSet.Sum(selector);
    }

    public int Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, int>> selector)
    {
        return _dbSet.Where(predicate).Sum(selector);
    }

    public int? Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, int?>> selector)
    {
        return _dbSet.Where(predicate).Sum(selector);
    }

    public async Task<int> SumAsync(Expression<Func<T, int>> selector)
    {
        return await _dbSet.SumAsync(selector);
    }

    public async Task<int?> SumAsync(Expression<Func<T, int?>> selector)
    {
        return await _dbSet.SumAsync(selector);
    }

    public async Task<int> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, int>> selector)
    {
        return await _dbSet.Where(predicate).SumAsync(selector);
    }

    public async Task<int?> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, int?>> selector)
    {
        return await _dbSet.Where(predicate).SumAsync(selector);
    }

    public long Sum(Expression<Func<T, long>> selector)
    {
        return _dbSet.Sum(selector);
    }

    public long? Sum(Expression<Func<T, long?>> selector)
    {
        return _dbSet.Sum(selector);
    }

    public long Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, long>> selector)
    {
        return _dbSet.Where(predicate).Sum(selector);
    }

    public long? Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, long?>> selector)
    {
        return _dbSet.Where(predicate).Sum(selector);
    }

    public async Task<long> SumAsync(Expression<Func<T, long>> selector)
    {
        return await _dbSet.SumAsync(selector);
    }

    public async Task<long?> SumAsync(Expression<Func<T, long?>> selector)
    {
        return await _dbSet.SumAsync(selector);
    }

    public async Task<long> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, long>> selector)
    {
        return await _dbSet.Where(predicate).SumAsync(selector);
    }

    public async Task<long?> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, long?>> selector)
    {
        return await _dbSet.Where(predicate).SumAsync(selector);
    }

    public float Sum(Expression<Func<T, float>> selector)
    {
        return _dbSet.Sum(selector);
    }

    public float? Sum(Expression<Func<T, float?>> selector)
    {
        return _dbSet.Sum(selector);
    }

    public float Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, float>> selector)
    {
        return _dbSet.Where(predicate).Sum(selector);
    }

    public float? Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, float?>> selector)
    {
        return _dbSet.Where(predicate).Sum(selector);
    }

    public async Task<float> SumAsync(Expression<Func<T, float>> selector)
    {
        return await _dbSet.SumAsync(selector);
    }

    public async Task<float?> SumAsync(Expression<Func<T, float?>> selector)
    {
        return await _dbSet.SumAsync(selector);
    }

    public async Task<float> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, float>> selector)
    {
        return await _dbSet.Where(predicate).SumAsync(selector);
    }

    public async Task<float?> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, float?>> selector)
    {
        return await _dbSet.Where(predicate).SumAsync(selector);
    }


}
