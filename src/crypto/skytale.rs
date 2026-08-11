/// Schreibt den Text zeilenweise und liest ihn anschließend spaltenweise aus.
pub fn encrypt(input: &str, columns: usize) -> Result<String, String> {
    validate_columns(columns)?;
    if input.is_empty() {
        return Ok(String::new());
    }

    let rows = table_rows(input, columns)?;
    let mut output = String::new();

    for column in 0..columns {
        for row in &rows {
            if let Some(Some(ch)) = row.get(column) {
                output.push(*ch);
            }
        }
    }

    Ok(output)
}

pub fn decrypt(input: &str, columns: usize) -> Result<String, String> {
    validate_columns(columns)?;
    if input.is_empty() {
        return Ok(String::new());
    }

    let chars: Vec<char> = input.chars().collect();
    let len = chars.len();
    let rows = len.div_ceil(columns);
    let last_row_len = if len.is_multiple_of(columns) {
        columns
    } else {
        len % columns
    };

    let mut table = vec![vec![None; columns]; rows];
    let mut index = 0;

    // Spalten in ihrer tatsächlichen Höhe befüllen. Die ersten Spalten
    // enthalten bei einer unvollständigen letzten Zeile ein Zeichen mehr.
    for column in 0..columns {
        let column_height = if column < last_row_len {
            rows
        } else {
            rows.saturating_sub(1)
        };

        for row in table.iter_mut().take(column_height) {
            if let Some(ch) = chars.get(index) {
                row[column] = Some(*ch);
                index += 1;
            }
        }
    }

    let mut output = String::new();
    for row in table {
        for ch in row.into_iter().flatten() {
            output.push(ch);
        }
    }

    Ok(output)
}

pub fn table_rows(input: &str, columns: usize) -> Result<Vec<Vec<Option<char>>>, String> {
    validate_columns(columns)?;
    if input.is_empty() {
        return Ok(vec![vec![None; columns]]);
    }

    let chars: Vec<char> = input.chars().collect();
    let mut rows = Vec::new();

    for chunk in chars.chunks(columns) {
        let mut row = vec![None; columns];
        for (index, ch) in chunk.iter().enumerate() {
            row[index] = Some(*ch);
        }
        rows.push(row);
    }

    Ok(rows)
}

fn validate_columns(columns: usize) -> Result<(), String> {
    if (2..=30).contains(&columns) {
        Ok(())
    } else {
        Err("Die Spaltenzahl muss zwischen 2 und 30 liegen.".to_string())
    }
}
