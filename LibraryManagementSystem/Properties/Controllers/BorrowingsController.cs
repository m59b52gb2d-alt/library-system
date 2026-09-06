using LibraryManagementSystem.Data;
using LibraryManagementSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BorrowingsController : ControllerBase
    {
        private readonly LibraryDbContext _context;

        public BorrowingsController(LibraryDbContext context)
        {
            _context = context;
        }

        // POST: api/Borrowings
        [HttpPost]
        public async Task<ActionResult<Borrowing>> BorrowBook(Borrowing borrowing)
        {
            var book = await _context.Books.FindAsync(borrowing.BookId);

            if (book == null)
            {
                return NotFound("Book not found.");
            }

            if (!book.IsAvailable)
            {
                return BadRequest("Book is already borrowed.");
            }

            book.IsAvailable = false;

            borrowing.BorrowDate = DateTime.Now;
            borrowing.IsReturned = false;

            _context.Borrowings.Add(borrowing);

            await _context.SaveChangesAsync();

            return Ok(borrowing);
        }

        // GET: api/Borrowings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Borrowing>>> GetBorrowings()
        {
            return await _context.Borrowings.ToListAsync();
        }

        // PUT: api/Borrowings/return/5
        [HttpPut("return/{id}")]
        public async Task<IActionResult> ReturnBook(int id)
        {
            var borrowing = await _context.Borrowings.FindAsync(id);

            if (borrowing == null)
            {
                return NotFound("Borrowing record not found.");
            }

            if (borrowing.IsReturned)
            {
                return BadRequest("Book is already returned.");
            }

            var book = await _context.Books.FindAsync(borrowing.BookId);

            if (book != null)
            {
                book.IsAvailable = true;
            }

            borrowing.IsReturned = true;
            borrowing.ReturnDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(borrowing);
        }
    }

}