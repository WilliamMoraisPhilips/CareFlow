package com.example.oracleapi;

import oracle.jdbc.OracleTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

@Service
public class ProfissionalService {

	@Autowired
	private DataSource dataSource;

	public ProfissionalService(DataSource dataSource) {
		this.dataSource = dataSource;
	}

	public void atualizarProfissional(Long id, ProfissionalDTO dto) {
		String sql = "{call T09D_P_ATUALIZAR_PROFISSIONAL(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}"; // Adjust SQL to
																										// reflect
																										// update
																										// procedure

		try (Connection conn = dataSource.getConnection();
				CallableStatement cs = conn.prepareCall(sql)) {

			// Set the ID as the first parameter for identification
			cs.setLong(1, id);

			// Parameters for "contract"
			cs.setString(2, dto.getContrato().getEmpresaContratante());
			cs.setDate(3, new java.sql.Date(dto.getContrato().getInicio().getTime()));
			cs.setDate(4, new java.sql.Date(dto.getContrato().getTermino().getTime()));
			cs.setInt(5, dto.getContrato().getCargaHorariaSemanal());
			cs.setDouble(6, dto.getContrato().getValorMensal());
			cs.setInt(7, dto.getContrato().getIdTipoContrato());
			cs.setInt(8, dto.getContrato().getIdTipoJornada());

			// Parameters for "address"
			cs.setString(9, dto.getEndereco().getLogradouro());
			cs.setString(10, dto.getEndereco().getComplemento());
			cs.setString(11, dto.getEndereco().getNumeroCasa());
			cs.setString(12, dto.getEndereco().getCep());
			cs.setInt(13, dto.getEndereco().getIdBairro());

			// Parameters for "professional"
			cs.setInt(14, dto.getIdSetor());
			cs.setString(15, dto.getNome());
			cs.setString(16, dto.getTelefone());
			cs.setString(17, dto.getCpf());

			// Handle optional CRM parameter
			if (dto.getCrm() != null) {
				cs.setString(18, dto.getCrm());
			} else {
				cs.setNull(18, java.sql.Types.VARCHAR);
			}

			cs.setDate(19, new java.sql.Date(dto.getDataNascimento().getTime()));

			// Check idNivelAcesso for null and handle appropriately
			if (dto.getIdNivelAcesso() != null) {
				cs.setInt(20, dto.getIdNivelAcesso());
			} else {
				cs.setInt(20, 1); // Default value or handle null scenario
			}

			if (dto.getIdCargo() != null) {
				cs.setInt(21, dto.getIdCargo());
			} else {
				cs.setInt(21, 1); // Default value or handle null scenario
			}

			// Execute the update procedure
			cs.executeUpdate();

		} catch (SQLException e) {
			// Basic exception handling
			e.printStackTrace();
		}
	}

	public void inserirProfissional(ProfissionalDTO dto) {
		String sql = "{call T09D_P_INSERIR_PROFISSIONAL(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}"; // Add one more
																									// placeholder
		try (Connection conn = dataSource.getConnection();
				CallableStatement cs = conn.prepareCall(sql)) {

			// Parameters for "contract"
			cs.setString(1, dto.getContrato().getEmpresaContratante());
			cs.setDate(2, new java.sql.Date(dto.getContrato().getInicio().getTime()));
			cs.setDate(3, new java.sql.Date(dto.getContrato().getTermino().getTime()));
			cs.setInt(4, dto.getContrato().getCargaHorariaSemanal());
			cs.setDouble(5, dto.getContrato().getValorMensal());
			cs.setInt(6, dto.getContrato().getIdTipoContrato());
			cs.setInt(7, dto.getContrato().getIdTipoJornada());

			// Parameters for "address"
			cs.setString(8, dto.getEndereco().getLogradouro());
			cs.setString(9, dto.getEndereco().getComplemento());
			cs.setString(10, dto.getEndereco().getNumeroCasa());
			cs.setString(11, dto.getEndereco().getCep());
			cs.setInt(12, dto.getEndereco().getIdBairro());

			// Parameters for "professional"
			cs.setInt(13, dto.getIdSetor());
			cs.setString(14, dto.getNome());
			cs.setString(15, dto.getTelefone());
			cs.setString(16, dto.getCpf());

			// Handle optional CRM parameter
			if (dto.getCrm() != null) {
				cs.setString(17, dto.getCrm());
			} else {
				cs.setNull(17, java.sql.Types.VARCHAR);
			}

			cs.setDate(18, new java.sql.Date(dto.getDataNascimento().getTime()));
			// Check idNivelAcesso for null and handle appropriately
			if (dto.getIdNivelAcesso() != null) {
				cs.setInt(19, dto.getIdNivelAcesso());
			} else {
				cs.setInt(19, 1); // Default value or handle null scenario
			}
			if (dto.getIdCargo() != null) {
				cs.setInt(20, dto.getIdCargo());
			} else {
				cs.setInt(20, 1); // Default value or handle null scenario
			}

			// Executa a procedure (sem retorno de valores)
			cs.executeUpdate();

		} catch (SQLException e) {
			// Tratamento básico de exceção
			e.printStackTrace();
		}
	}

	public List<Map<String, Object>> obterProfissionaisNome(String nome) throws SQLException {
		List<Map<String, Object>> lista = new ArrayList<>();

		try (Connection conn = dataSource.getConnection();
				CallableStatement stmt = conn.prepareCall("{call T09D_P_OBTER_PROFISSIONAL_POR_NOME(?, ?)}")) {

			// Set the input parameter
			stmt.setString(1, nome);

			// Register the output parameter
			stmt.registerOutParameter(2, OracleTypes.CURSOR);

			// Execute the call
			stmt.execute();

			// Retrieve the cursor and process the result set
			try (ResultSet rs = (ResultSet) stmt.getObject(2)) {
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

	public List<Map<String, Object>> obterProfissionaisSetor(String setor) throws SQLException {
		List<Map<String, Object>> lista = new ArrayList<>();

		try (Connection conn = dataSource.getConnection();
				CallableStatement stmt = conn.prepareCall("{call T09D_P_OBTER_PROFISSIONAL_POR_SETOR(?, ?)}")) {

			// Set the input parameter
			stmt.setString(1, setor);

			// Register the output parameter
			stmt.registerOutParameter(2, OracleTypes.CURSOR);

			// Execute the call
			stmt.execute();

			// Retrieve the cursor and process the result set
			try (ResultSet rs = (ResultSet) stmt.getObject(2)) {
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

	public List<Map<String, Object>> obterCargos() throws SQLException {
		List<Map<String, Object>> lista = new ArrayList<>();

		try (Connection conn = dataSource.getConnection();
				CallableStatement stmt = conn.prepareCall("{call T09D_P_OBTER_CARGOS(?)}")) {

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

	public List<Map<String, Object>> obterSetores() throws SQLException {
		List<Map<String, Object>> lista = new ArrayList<>();

		try (Connection conn = dataSource.getConnection();
				CallableStatement stmt = conn.prepareCall("{call T09D_P_OBTER_SETORES(?)}")) {

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

	public List<Map<String, Object>> obterProfissionais() throws SQLException {
		List<Map<String, Object>> lista = new ArrayList<>();

		try (Connection conn = dataSource.getConnection();
				CallableStatement stmt = conn.prepareCall("{call T09D_P_OBTER_PROFISSIONAIS(?)}")) {

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

	// public List<Map<String, Object>> buscarAcoesExames() throws SQLException {
	// List<Map<String, Object>> lista = new ArrayList<>();

	// try (Connection conn = dataSource.getConnection();
	// CallableStatement stmt = conn.prepareCall("{call BUSCAR_ACOES_EXAMES(?)}")) {

	// stmt.registerOutParameter(1, OracleTypes.CURSOR);
	// stmt.execute();

	// try (ResultSet rs = (ResultSet) stmt.getObject(1)) {
	// ResultSetMetaData meta = rs.getMetaData();
	// int colCount = meta.getColumnCount();

	// while (rs.next()) {
	// Map<String, Object> row = new HashMap<>();
	// for (int i = 1; i <= colCount; i++) {
	// row.put(meta.getColumnLabel(i), rs.getObject(i));
	// }
	// lista.add(row);
	// }
	// }
	// }

	// return lista;
	// }

	// Inserir novo registro
	// public ProfissionalDTO inserirAcao(ProfissionalDTO dto) throws SQLException {
	// try (Connection conn = dataSource.getConnection();
	// CallableStatement stmt = conn.prepareCall("{call INSERIR_ACAO_EXAME(?, ?, ?,
	// ?, ?)}")) {
	// stmt.setInt(1, dto.nrSequencia);
	// stmt.setString(2, dto.dsObservacao);
	// stmt.setString(3, dto.dsAcao);
	// stmt.setString(4, dto.nmUsuario);
	// stmt.setDate(5, new java.sql.Date(dto.dtAtualizacao.getTime()));
	// stmt.execute();
	// }
	// return dto;
	// }

	// // Buscar por ID
	// public ProfissionalDTO buscarPorId(int id) throws SQLException {
	// try (Connection conn = dataSource.getConnection();
	// CallableStatement stmt = conn.prepareCall("{call BUSCAR_ACAO_EXAME_POR_ID(?,
	// ?)}")) {
	// stmt.setInt(1, id);
	// stmt.registerOutParameter(2, OracleTypes.CURSOR);
	// stmt.execute();

	// try (ResultSet rs = (ResultSet) stmt.getObject(2)) {
	// if (rs.next()) {
	// ProfissionalDTO dto = new ProfissionalDTO();
	// dto.nrSequencia = rs.getInt("NR_SEQUENCIA");
	// dto.dsObservacao = rs.getString("DS_OBSERVACAO");
	// dto.dsAcao = rs.getString("DS_ACAO");
	// dto.dtAtualizacao = rs.getDate("DT_ATUALIZACAO");
	// dto.nmUsuario = rs.getString("NM_USUARIO");
	// return dto;
	// }
	// }
	// }
	// return null;
	// }

	// // Atualizar
	// public ProfissionalDTO atualizarAcao(int id, ProfissionalDTO dto) throws
	// SQLException {
	// try (Connection conn = dataSource.getConnection();
	// CallableStatement stmt = conn.prepareCall("{call ATUALIZAR_ACAO_EXAME(?, ?,
	// ?, ?, ?)}")) {
	// stmt.setInt(1, id);
	// stmt.setString(2, dto.dsObservacao);
	// stmt.setString(3, dto.dsAcao);
	// stmt.setString(4, dto.nmUsuario);
	// stmt.setDate(5, new java.sql.Date(dto.dtAtualizacao.getTime()));
	// stmt.execute();
	// }
	// return buscarPorId(dto.nrSequencia);
	// }

	// // Remover
	// public void deletarAcao(int id) throws SQLException {
	// try (Connection conn = dataSource.getConnection();
	// CallableStatement stmt = conn.prepareCall("{call DELETAR_ACAO_EXAME(?)}")) {
	// stmt.setInt(1, id);
	// stmt.execute();
	// }
	// }

}
