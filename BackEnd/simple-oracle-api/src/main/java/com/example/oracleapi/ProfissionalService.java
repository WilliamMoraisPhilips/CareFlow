package com.example.oracleapi;

import oracle.jdbc.OracleTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;

import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProfissionalService {

	@Autowired
	private DataSource dataSource;

	public ProfissionalService(DataSource dataSource) {
		this.dataSource = dataSource;
	}

	public void atualizarProfissional(Integer id, ProfissionalDTO profissionalDTO) {
		String especializacaoCsv = String.join(",", profissionalDTO.getEspecializacao());

		String sql = "{call T09D_P_ATUALIZAR_PROFISSIONAL(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}";

		try (Connection conn = dataSource.getConnection();
				CallableStatement cs = conn.prepareCall(sql)) {

			cs.setInt(1, profissionalDTO.getIdProfissional()); // ✅ Added ID for update
			cs.setString(2, profissionalDTO.getContrato().getEmpresaContratante());
			cs.setDate(3, new java.sql.Date(profissionalDTO.getContrato().getInicio().getTime()));

			java.sql.Date terminoDate = profissionalDTO.getContrato().getTermino() == null
					? null
					: new java.sql.Date(profissionalDTO.getContrato().getTermino().getTime());
			cs.setDate(4, terminoDate);
			cs.setInt(5, profissionalDTO.getContrato().getCargaHorariaSemanal());
			cs.setDouble(6, profissionalDTO.getContrato().getValorMensal());
			cs.setInt(7, profissionalDTO.getContrato().getIdTipoContrato());
			cs.setInt(8, profissionalDTO.getContrato().getIdTipoJornada());
			cs.setInt(9, profissionalDTO.getContrato().getStatus());

			// Address params
			cs.setString(10, profissionalDTO.getEndereco().getLogradouro());
			cs.setString(11, profissionalDTO.getEndereco().getComplemento());
			cs.setString(12, profissionalDTO.getEndereco().getNumeroCasa());
			cs.setString(13, profissionalDTO.getEndereco().getCep());
			cs.setInt(14, profissionalDTO.getEndereco().getIdBairro());

			// Professional fields
			cs.setInt(15, profissionalDTO.getIdSetor());
			cs.setString(16, profissionalDTO.getNome());
			cs.setString(17, profissionalDTO.getTelefone());
			cs.setString(18, profissionalDTO.getCpf());

			if (profissionalDTO.getCrm() != null && !profissionalDTO.getCrm().isEmpty()) {
				cs.setString(19, profissionalDTO.getCrm());
			} else {
				cs.setNull(19, java.sql.Types.VARCHAR);
			}

			cs.setDate(20, new java.sql.Date(profissionalDTO.getDataNascimento().getTime()));
			cs.setInt(21, profissionalDTO.getIdNivelAcesso());
			cs.setInt(22, profissionalDTO.getIdCargo());
			cs.setInt(23, profissionalDTO.getIdFormacao());
			cs.setString(24, especializacaoCsv); // ✅ Fix: Passing as a string

			// ✅ Execute update for main professional data
			cs.executeUpdate();

			// ✅ Delete existing specializations before reinserting
			String deleteEspecializacaoSql = "DELETE FROM T09D_PROFISSIONAL_ESPEC WHERE ID_PROFISSIONAL = ?";
			try (PreparedStatement ps = conn.prepareStatement(deleteEspecializacaoSql)) {
				ps.setInt(1, profissionalDTO.getIdProfissional());
				ps.executeUpdate();
			}

			// ✅ Insert new specializations manually
			if (profissionalDTO.getEspecializacao() != null && !profissionalDTO.getEspecializacao().isEmpty()) {
				String especializacaoSql = "INSERT INTO T09D_PROFISSIONAL_ESPEC (ID_PROFISSIONAL, ID_ESPECIALIZACAO) VALUES (?, ?)";

				try (PreparedStatement ps = conn.prepareStatement(especializacaoSql)) {
					for (String especializacaoId : profissionalDTO.getEspecializacao()) {
						ps.setInt(1, profissionalDTO.getIdProfissional());
						ps.setInt(2, Integer.parseInt(especializacaoId)); // ✅ Convert String to Integer
						ps.executeUpdate();
					}
				}
			}

		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public void inserirProfissional(ProfissionalDTO dto) {
		String especializacaoCsv = dto.getEspecializacao().stream()
				.collect(Collectors.joining(","));
		String sql = "{call T09D_P_INSERIR_PROFISSIONAL(" +
				"?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}";

		try (Connection conn = dataSource.getConnection();
				CallableStatement cs = conn.prepareCall(sql)) {

			// Ensure "termino" is null if received as an empty string
			java.sql.Date terminoDate = dto.getContrato().getTermino() == null
					? null
					: new java.sql.Date(dto.getContrato().getTermino().getTime());

			// Pass core profissional data
			cs.setString(1, dto.getContrato().getEmpresaContratante());
			cs.setDate(2, new java.sql.Date(dto.getContrato().getInicio().getTime()));
			cs.setDate(3, terminoDate); // ✅ Now correctly handling empty "termino" values
			cs.setInt(4, dto.getContrato().getCargaHorariaSemanal());
			cs.setDouble(5, dto.getContrato().getValorMensal());
			cs.setInt(6, dto.getContrato().getIdTipoContrato());
			cs.setInt(7, dto.getContrato().getIdTipoJornada());

			cs.setInt(8, dto.getContrato().getStatus()); // ← p_status
			// now shift all the address params one slot later:
			cs.setString(9, dto.getEndereco().getLogradouro());
			cs.setString(10, dto.getEndereco().getComplemento());
			cs.setString(11, dto.getEndereco().getNumeroCasa());
			cs.setString(12, dto.getEndereco().getCep());
			cs.setInt(13, dto.getEndereco().getIdBairro());

			// then profissional fields:
			cs.setInt(14, dto.getIdSetor());
			cs.setString(15, dto.getNome());
			cs.setString(16, dto.getTelefone());
			cs.setString(17, dto.getCpf());
			if (dto.getCrm() != null && !dto.getCrm().isEmpty()) {
				cs.setString(18, dto.getCrm()); // ✅ Set actual value
			} else {
				cs.setNull(18, java.sql.Types.VARCHAR); // ✅ If null, explicitly set as SQL NULL
			}

			cs.setDate(19, new java.sql.Date(dto.getDataNascimento().getTime()));
			cs.setInt(20, dto.getIdNivelAcesso());
			cs.setInt(21, dto.getIdCargo());

			// if you truly have a p_id_formacao:
			cs.setInt(22, dto.getIdFormacao());
			cs.setString(23, especializacaoCsv);
			// and if you also left p_especializacao in the proc:

			// Execute procedure for the main profissional data
			cs.executeUpdate();
			int profissionalId;
			String fetchSql = "SELECT ID FROM T09D_PROFISSIONAL WHERE CPF = ? ORDER BY ID DESC FETCH FIRST 1 ROWS ONLY";
			try (PreparedStatement ps = conn.prepareStatement(fetchSql)) {
				ps.setString(1, dto.getCpf());
				try (ResultSet rs = ps.executeQuery()) {
					if (rs.next()) {
						profissionalId = rs.getInt("ID");
					} else {
						throw new SQLException("Could not fetch new PROFESSIONAL ID");
					}
				}
			}

			// Convert "especializacao" string into a list before insertion
			if (dto.getEspecializacao() != null && !dto.getEspecializacao().isEmpty()) {
				String especializacaoSql = "INSERT INTO T09D_PROFISSIONAL_ESPEC (ID_PROFISSIONAL, ID_ESPECIALIZACAO) VALUES (?, ?)";

				try (PreparedStatement ps = conn.prepareStatement(especializacaoSql)) {
					for (String especializacaoId : dto.getEspecializacao()) {
						ps.setInt(1, profissionalId);
						ps.setInt(2, Integer.parseInt(especializacaoId));
						ps.executeUpdate();
					}
				}
			}

		} catch (SQLException e) {
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

	public List<Map<String, Object>> obterProfissionaisCargo(String cargo) throws SQLException {
		List<Map<String, Object>> lista = new ArrayList<>();

		try (Connection conn = dataSource.getConnection();
				CallableStatement stmt = conn.prepareCall("{call T09D_P_OBTER_PROFISSIONAL_POR_CARGO(?, ?)}")) {

			// Set the input parameter
			stmt.setString(1, cargo);

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

	public List<Map<String, Object>> obterFormacao() throws SQLException {
		List<Map<String, Object>> lista = new ArrayList<>();

		try (Connection conn = dataSource.getConnection();
				CallableStatement stmt = conn.prepareCall("{call T09D_P_OBTER_FORMACAO(?)}")) {

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

	public List<Map<String, Object>> obterBairros() throws SQLException {
		List<Map<String, Object>> lista = new ArrayList<>();

		try (Connection conn = dataSource.getConnection();
				CallableStatement stmt = conn.prepareCall("{call T09D_P_OBTER_BAIRROS(?)}")) {

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

	public List<Map<String, Object>> obterNiveisDeAcesso() throws SQLException {
		List<Map<String, Object>> lista = new ArrayList<>();

		try (Connection conn = dataSource.getConnection();
				CallableStatement stmt = conn.prepareCall("{call T09D_P_OBTER_NIVEL_DE_ACESSO(?)}")) {

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

	public List<Map<String, Object>> obterJornadas() throws SQLException {
		List<Map<String, Object>> lista = new ArrayList<>();

		try (Connection conn = dataSource.getConnection();
				CallableStatement stmt = conn.prepareCall("{call T09D_P_OBTER_TIPO_JORNADA(?)}")) {

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

	public List<Map<String, Object>> obterEspecializacoes() throws SQLException {
		List<Map<String, Object>> lista = new ArrayList<>();

		try (Connection conn = dataSource.getConnection();
				CallableStatement stmt = conn.prepareCall("{call T09D_P_OBTER_ESPECIALIZACAO(?)}")) {

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

	public List<Map<String, Object>> obterContratos() throws SQLException {
		List<Map<String, Object>> lista = new ArrayList<>();

		try (Connection conn = dataSource.getConnection();
				CallableStatement stmt = conn.prepareCall("{call T09D_P_OBTER_CONTRATOS(?)}")) {

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

	public boolean removerProfissionalPorId(int id) throws SQLException {
		try (Connection conn = dataSource.getConnection();
				CallableStatement stmt = conn.prepareCall("{call T09D_P_DELETE_PROFISSIONAL(?)}")) {
			stmt.setInt(1, id);

			// Execute the stored procedure
			int affectedRows = stmt.executeUpdate();

			// Assuming the stored procedure affects rows when deletion is successful,
			// we will return true if affectedRows are greater than 0.
			return affectedRows > 0;

		} catch (SQLException e) {
			// Log exception and rethrow it or handle it accordingly
			throw e;
		}
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
