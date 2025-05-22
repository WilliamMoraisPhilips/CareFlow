package com.example.oracleapi;

import oracle.jdbc.OracleTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

@Service
public class AcoesExamesService {

    @Autowired
    private DataSource dataSource;

    public List<Map<String, Object>> buscarAcoesExames() throws SQLException {
        List<Map<String, Object>> lista = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
             CallableStatement stmt = conn.prepareCall("{call BUSCAR_ACOES_EXAMES(?)}")) {

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
	
	
	// Inserir novo registro
	public AcaoExameDTO  inserirAcao(AcaoExameDTO dto) throws SQLException {
		try (Connection conn = dataSource.getConnection();
			 CallableStatement stmt = conn.prepareCall("{call INSERIR_ACAO_EXAME(?, ?, ?, ?, ?)}")) {
			stmt.setInt(1, dto.nrSequencia);
			stmt.setString(2, dto.dsObservacao);
			stmt.setString(3, dto.dsAcao);
			stmt.setString(4, dto.nmUsuario);
			stmt.setDate(5, new java.sql.Date(dto.dtAtualizacao.getTime()));
			stmt.execute();
		}
		return dto;
	}

	// Buscar por ID
	public AcaoExameDTO buscarPorId(int id) throws SQLException {
		try (Connection conn = dataSource.getConnection();
			 CallableStatement stmt = conn.prepareCall("{call BUSCAR_ACAO_EXAME_POR_ID(?, ?)}")) {
			stmt.setInt(1, id);
			stmt.registerOutParameter(2, OracleTypes.CURSOR);
			stmt.execute();

			try (ResultSet rs = (ResultSet) stmt.getObject(2)) {
				if (rs.next()) {
					AcaoExameDTO dto = new AcaoExameDTO();
					dto.nrSequencia = rs.getInt("NR_SEQUENCIA");
					dto.dsObservacao = rs.getString("DS_OBSERVACAO");
					dto.dsAcao = rs.getString("DS_ACAO");
					dto.dtAtualizacao = rs.getDate("DT_ATUALIZACAO");
					dto.nmUsuario = rs.getString("NM_USUARIO");
					return dto;
				}
			}
		}
		return null;
	}

	// Atualizar
	public AcaoExameDTO atualizarAcao(int id, AcaoExameDTO dto) throws SQLException {
		try (Connection conn = dataSource.getConnection();
			 CallableStatement stmt = conn.prepareCall("{call ATUALIZAR_ACAO_EXAME(?, ?, ?, ?, ?)}")) {
			stmt.setInt(1, id);
			stmt.setString(2, dto.dsObservacao);
			stmt.setString(3, dto.dsAcao);
			stmt.setString(4, dto.nmUsuario);
			stmt.setDate(5, new java.sql.Date(dto.dtAtualizacao.getTime()));
			stmt.execute();
		}
		return buscarPorId(dto.nrSequencia);
	}

	// Remover
	public void deletarAcao(int id) throws SQLException {
		try (Connection conn = dataSource.getConnection();
			 CallableStatement stmt = conn.prepareCall("{call DELETAR_ACAO_EXAME(?)}")) {
			stmt.setInt(1, id);
			stmt.execute();
		}
	}
	
}
