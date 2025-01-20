export function convertCSVToSQL(csvContent: string): string {
  // Split the CSV content into lines and remove empty lines
  const lines = csvContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  // Remove header line
  const dataLines = lines.slice(1);

  // Store policy numbers for the final SELECT
  const policyNumbers = dataLines.map(line => {
    const [policy_number] = line.split(';').map(value => value.trim());
    return `'${policy_number}'`;
  });

  // Convert each line to SQL
  const sqlStatements = dataLines.map(line => {
    const [policy_number, date] = line.split(';').map(value => value.trim());
    
    // Format date from DD/MM/YYYY to YYYY-MM-DD
    const [day, month, year] = date.split('/');
    const formattedDate = `${year}-${month}-${day}`;

    return `UPDATE platform_insurers.policy 
SET cancel_date = '${formattedDate}',
    reason = 'Sinistro',
    refund = 0,
    status_id = 4
WHERE partner_policy_number = '${policy_number}';`;
  });

  // Add the SELECT statement at the end with specific columns and IN clause
  sqlStatements.push(`
-- Verify the updated records
SELECT partner_policy_number, cancel_date, reason, refund, status_id 
FROM platform_insurers.policy 
WHERE partner_policy_number IN (${policyNumbers.join(', ')});`);

  // Join all SQL statements with newlines
  return sqlStatements.join('\n\n');
}