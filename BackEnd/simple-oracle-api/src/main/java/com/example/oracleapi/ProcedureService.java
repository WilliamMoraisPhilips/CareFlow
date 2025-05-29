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

    public void atualizarProfessional(FormDataDTO formDataDTO) {
        // PL/SQL call string: one placeholder (?) for each procedure parameter
        String call = "{call T09D_P_ATUALIZAR_PROFISSIONAL(" +
                "?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}";
        try (Connection conn = dataSource.getConnection();
                CallableStatement stmt = conn.prepareCall(call)) {
            ContratoDTO contrato = formDataDTO.getContrato();
            EnderecoDTO endereco = formDataDTO.getEndereco();

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

            stmt.setString(6, endereco.getLogradouro());
            stmt.setString(7, endereco.getComplemento());
            stmt.setString(8, endereco.getNumeroCasa());
            stmt.setString(9, endereco.getCep());
            // stmt.setString(10, bairro.getBairroUF());
            // stmt.setString(11, bairro.getBairroMunicipio());
            // stmt.setString(12, bairro.getBairroNome());
            stmt.setInt(12, 12);

            stmt.setString(13, formDataDTO.getSetor());
            stmt.setInt(14, contrato.getIdTipoContrato());
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
            // verificar depois
            // Convert date strings to java.sql.Date
            if (contrato.getInicio() != null) {
                stmt.setDate(19, new java.sql.Date(contrato.getInicio().getTime()));
            } else {
                stmt.setNull(19, Types.DATE);
            }

            if (contrato.getTermino() != null) {
                stmt.setDate(20, new java.sql.Date(contrato.getTermino().getTime()));
            } else {
                stmt.setNull(20, Types.DATE);
            }
            stmt.setString(21, contrato.getEmpresaContratante());
            stmt.setInt(22, contrato.getStatus());

            // Convert cargaHoraria (String) to Integer
            if (contrato.getCargaHorariaSemanal() != null) {
                stmt.setInt(23, contrato.getCargaHorariaSemanal());
            } else {
                stmt.setNull(23, Types.INTEGER);
            }

            Double valorMensal = contrato.getValorMensal();
            if (valorMensal != null) {
                stmt.setBigDecimal(24, BigDecimal.valueOf(valorMensal));
            } else {
                stmt.setNull(24, Types.DECIMAL);
            }

            int idTipoJornada = contrato.getIdTipoJornada();
            stmt.setString(25, String.valueOf(idTipoJornada));

            // Execute the stored procedure
            stmt.execute();
            LOGGER.info("Successfully inserted professional with CPF {}", formDataDTO.getCpf());
        } catch (SQLException e) {
            LOGGER.error("Failed to insert professional: {}", e.getMessage(), e);
            // Rethrow as unchecked exception after logging
            throw new RuntimeException("Error executing stored procedure T09D_P_ATUALIZAR_PROFISSIONAL", e);
        }
    }

    public void insertProfessional(FormDataDTO formDataDTO) {
        // PL/SQL call string: one placeholder (?) for each procedure parameter
        String call = "{call T09D_P_INSERIR_PROFISSIONAL(" +
                "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}";
        try (Connection conn = dataSource.getConnection();
                CallableStatement stmt = conn.prepareCall(call)) {
            ContratoDTO contrato = formDataDTO.getContrato();
            EnderecoDTO endereco = formDataDTO.getEndereco();
            BairroDTO bairro = endereco.getBairro();

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

            stmt.setString(6, endereco.getLogradouro());
            stmt.setString(7, endereco.getComplemento());
            stmt.setString(8, endereco.getNumeroCasa());
            stmt.setString(9, endereco.getCep());
            // stmt.setString(10, bairro.getBairroUF());
            // stmt.setString(11, bairro.getBairroMunicipio());
            // stmt.setString(12, bairro.getBairroNome());
            stmt.setInt(12, 12);

            stmt.setString(13, formDataDTO.getSetor());
            stmt.setInt(14, contrato.getIdTipoContrato());
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
            // verificar depois
            // Convert date strings to java.sql.Date
            if (contrato.getInicio() != null) {
                stmt.setDate(19, new java.sql.Date(contrato.getInicio().getTime()));
            } else {
                stmt.setNull(19, Types.DATE);
            }

            if (contrato.getTermino() != null) {
                stmt.setDate(20, new java.sql.Date(contrato.getTermino().getTime()));
            } else {
                stmt.setNull(20, Types.DATE);
            }
            stmt.setString(21, contrato.getEmpresaContratante());
            stmt.setInt(22, contrato.getStatus());

            // Convert cargaHoraria (String) to Integer
            if (contrato.getCargaHorariaSemanal() != null) {
                stmt.setInt(23, contrato.getCargaHorariaSemanal());
            } else {
                stmt.setNull(23, Types.INTEGER);
            }

            Double valorMensal = contrato.getValorMensal();
            if (valorMensal != null) {
                stmt.setBigDecimal(24, BigDecimal.valueOf(valorMensal));
            } else {
                stmt.setNull(24, Types.DECIMAL);
            }

            int idTipoJornada = contrato.getIdTipoJornada();
            stmt.setString(25, String.valueOf(idTipoJornada));

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
