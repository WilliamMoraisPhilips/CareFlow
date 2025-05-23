package com.example.oracleapi;

import oracle.jdbc.OracleTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

@Service
public class PacienteVacinasService {

    @Autowired
    private DataSource dataSource;

    public List<Map<String, Object>> buscarPacienteVacinas() throws SQLException {
        List<Map<String, Object>> lista = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
             CallableStatement stmt = conn.prepareCall("{call BUSCAR_PACIENTE_VACINAS(?)}")) {

            stmt.registerOutParameter(1, OracleTypes.CURSOR);
            stmt.execute();

            try (ResultSet rs = (ResultSet) stmt.getObject(1)) {
                ResultSetMetaData meta = rs.getMetaData();
                int colCount = meta.getColumnCount();

                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    for (int i = 1; i <= colCount; i++) {
                        row.put(meta.getColumnLabel(i), rs.getObject(i));
                    }
                    lista.add(row);
                }
            }
        }

        return lista;
    }
}
