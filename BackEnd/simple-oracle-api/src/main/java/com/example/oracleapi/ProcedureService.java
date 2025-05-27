package com.example.oracleapi;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.*;

@Service
public class ProcedureService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ProcedureService.class);

    @Autowired
    private DataSource dataSource;

    public void insertProfessional(FormDataDTO formDataDTO) {
        // PL/SQL call string: one placeholder (?) for each procedure parameter
        String call = "{call T09D_P_INSERIR_PROFISSIONAL(" +
                "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}";
        try (Connection conn = dataSource.getConnection();
                CallableStatement stmt = conn.prepareCall(call)) {

            // Set IN parameters from DTO (indexed from 1)
            stmt.setString(1, formDataDTO.getNome());
            stmt.setString(2, formDataDTO.getTelefone());
            stmt.setString(3, formDataDTO.getCpf());
            stmt.setString(4, formDataDTO.getCrmCoren());

            // Convert dataNascimento (String) to java.sql.Date
            if (formDataDTO.getDataNascimento() != null && !formDataDTO.getDataNascimento().isEmpty()) {
                stmt.setDate(5, Date.valueOf(formDataDTO.getDataNascimento()));
            } else {
                stmt.setNull(5, Types.DATE);
            }

            stmt.setString(6, formDataDTO.getLogradouro());
            stmt.setString(7, formDataDTO.getComplemento());
            stmt.setString(8, formDataDTO.getNumeroCasa());
            stmt.setString(9, formDataDTO.getCep());
            stmt.setString(10, formDataDTO.getBairroUF());
            stmt.setString(11, formDataDTO.getBairroMunicipio());
            stmt.setString(12, formDataDTO.getBairroNome());

            stmt.setString(13, formDataDTO.getSetor());
            stmt.setString(14, formDataDTO.getContrato());
            stmt.setString(15, formDataDTO.getCargo());
            stmt.setString(16, formDataDTO.getNivelAcesso());
            stmt.setString(17, formDataDTO.getFormacao());

            // Handle array for especializacao (if supported by the procedure)
            String[] especializacoes = formDataDTO.getEspecializacao();
            if (especializacoes != null && especializacoes.length > 0) {
                // Assuming the Oracle type is VARCHAR
                Array array = conn.createArrayOf("VARCHAR", especializacoes);
                stmt.setArray(18, array);
            } else {
                stmt.setNull(18, Types.ARRAY);
            }

            // Convert date strings to java.sql.Date
            if (formDataDTO.getInicio() != null && !formDataDTO.getInicio().isEmpty()) {
                stmt.setDate(19, Date.valueOf(formDataDTO.getInicio()));
            } else {
                stmt.setNull(19, Types.DATE);
            }
            if (formDataDTO.getTermino() != null && !formDataDTO.getTermino().isEmpty()) {
                stmt.setDate(20, Date.valueOf(formDataDTO.getTermino()));
            } else {
                stmt.setNull(20, Types.DATE);
            }

            stmt.setString(21, formDataDTO.getEmpresa());
            stmt.setString(22, formDataDTO.getStatus());

            // Convert cargaHoraria (String) to Integer
            if (formDataDTO.getCargaHoraria() != null && !formDataDTO.getCargaHoraria().isEmpty()) {
                try {
                    stmt.setInt(23, Integer.parseInt(formDataDTO.getCargaHoraria()));
                } catch (NumberFormatException e) {
                    stmt.setNull(23, Types.INTEGER);
                }
            } else {
                stmt.setNull(23, Types.INTEGER);
            }

            // Convert salario (String) to BigDecimal
            if (formDataDTO.getSalario() != null && !formDataDTO.getSalario().isEmpty()) {
                try {
                    stmt.setBigDecimal(24, new BigDecimal(formDataDTO.getSalario()));
                } catch (NumberFormatException e) {
                    stmt.setNull(24, Types.DECIMAL);
                }
            } else {
                stmt.setNull(24, Types.DECIMAL);
            }

            stmt.setString(25, formDataDTO.getJornada());

            // Execute the stored procedure
            stmt.execute();
            LOGGER.info("Successfully inserted professional with CPF {}", formDataDTO.getCpf());
        } catch (SQLException e) {
            LOGGER.error("Failed to insert professional: {}", e.getMessage(), e);
            // Rethrow as unchecked exception after logging
            throw new RuntimeException("Error executing stored procedure T09D_P_INSERIR_PROFISSIONAL", e);
        }
    }
}
