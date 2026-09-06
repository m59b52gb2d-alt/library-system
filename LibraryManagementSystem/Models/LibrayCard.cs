namespace LibraryManagementSystem.Models
{
    public class LibraryCard
    {
        public int Id { get; set; }

        public string CardNumber { get; set; } = string.Empty;

        public int UserId { get; set; }

        public DateTime IssueDate { get; set; }
    }
}