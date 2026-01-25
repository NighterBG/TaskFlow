using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskFlow.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLibrarianAchievement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Achievements",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 25, 3, 29, 5, 46, DateTimeKind.Utc).AddTicks(6206));

            migrationBuilder.UpdateData(
                table: "Achievements",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 25, 3, 29, 5, 46, DateTimeKind.Utc).AddTicks(6209));

            migrationBuilder.UpdateData(
                table: "Achievements",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 25, 3, 29, 5, 46, DateTimeKind.Utc).AddTicks(6211));

            migrationBuilder.UpdateData(
                table: "Achievements",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 25, 3, 29, 5, 46, DateTimeKind.Utc).AddTicks(6212));

            migrationBuilder.UpdateData(
                table: "Achievements",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 25, 3, 29, 5, 46, DateTimeKind.Utc).AddTicks(6213));

            migrationBuilder.InsertData(
                table: "Achievements",
                columns: new[] { "Id", "CreatedAt", "Description", "IconKey", "LastModifiedAt", "Name" },
                values: new object[] { 6, new DateTime(2026, 1, 25, 3, 29, 5, 46, DateTimeKind.Utc).AddTicks(6214), "Archived 10 tasks to tidy your space.", "Book", null, "Librarian" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Achievements",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.UpdateData(
                table: "Achievements",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 25, 3, 26, 41, 603, DateTimeKind.Utc).AddTicks(8944));

            migrationBuilder.UpdateData(
                table: "Achievements",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 25, 3, 26, 41, 603, DateTimeKind.Utc).AddTicks(8948));

            migrationBuilder.UpdateData(
                table: "Achievements",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 25, 3, 26, 41, 603, DateTimeKind.Utc).AddTicks(8950));

            migrationBuilder.UpdateData(
                table: "Achievements",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 25, 3, 26, 41, 603, DateTimeKind.Utc).AddTicks(8951));

            migrationBuilder.UpdateData(
                table: "Achievements",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 25, 3, 26, 41, 603, DateTimeKind.Utc).AddTicks(8952));
        }
    }
}
