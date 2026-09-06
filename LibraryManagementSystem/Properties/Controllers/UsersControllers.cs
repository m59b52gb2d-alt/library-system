using LibraryManagementSystem.Data;
using LibraryManagementSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagementSystem.Controllers
{
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
private readonly LibraryDbContext _context;

    public UsersController(LibraryDbContext context)
    {
        _context = context;
    }
    // GET: api/Users
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }
    // POST: api/Users/register
    [HttpPost("register")]
    public async Task<ActionResult<User>> Register(User user)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == user.Email);
        if (existingUser != null)
        {
            return BadRequest("Email already registered.");
        }
        user.Role = "User";
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return Ok(user);
    }
    // POST: api/Users/login
    [HttpPost("login")]
    public async Task<ActionResult<User>> Login(User loginUser)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u =>
                u.Email == loginUser.Email &&
                u.Password == loginUser.Password);
        if (user == null)
        {
            return Unauthorized("Invalid email or password.");
        }
        return Ok(user);
    }
}

}