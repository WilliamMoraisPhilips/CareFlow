package com.example.oracleapi;

import oracle.jdbc.OracleTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class RelatorioService {

    @Autowired
    private DataSource dataSource;

    public RelatorioService(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public RelatorioDTO getRelatorioPorId(Long id) throws SQLException {
        String sql = "{call T09D_P_OBTER_PROF_PARA_RELAT(?, ?)}";
        try (Connection conn = dataSource.getConnection();
             CallableStatement cs = conn.prepareCall(sql)) {

            cs.setLong(1, id);
            cs.registerOutParameter(2, OracleTypes.CURSOR);
            cs.execute();

            try (ResultSet rs = (ResultSet) cs.getObject(2)) {
                // Se não há linhas, retorna null
                if (!rs.next()) {
                    return null;
                }

                // ------ primeiro registro: mapeia todos os campos fixos ------
                RelatorioDTO dto = new RelatorioDTO();
                dto.setId(rs.getLong("ID"));
                dto.setNome(rs.getString("NOME"));
                dto.setCpf(rs.getString("CPF"));
                dto.setCrm(rs.getString("CRM"));
                dto.setTelefone(rs.getString("TELEFONE"));
                dto.setDataNascimento(rs.getDate("DATA_NASCIMENTO"));
                dto.setSetor(rs.getString("SETOR"));
                dto.setCargo(rs.getString("CARGO"));
                dto.setNivelAcesso(rs.getString("NIVEL_ACESSO"));
                dto.setFormacao(rs.getString("FORMACAO"));

                dto.setLogradouro(rs.getString("LOGRADOURO"));
                dto.setComplemento(rs.getString("COMPLEMENTO"));
                dto.setNumeroCasa(rs.getString("NUMERO_CASA"));
                dto.setNumeroCep(rs.getString("NUMERO_CEP"));
                dto.setBairro(rs.getString("BAIRRO"));
                dto.setMunicipio(rs.getString("MUNICIPIO"));
                dto.setSiglaUf(rs.getString("SIGLA_UF"));
                dto.setEmpresaContratante(rs.getString("EMPRESA_CONTRATANTE"));
                dto.setTipoJornada(rs.getString("TIPO_JORNADA"));
                dto.setTipoContrato(rs.getString("TIPO_CONTRATO"));
                dto.setDataAdmissao(rs.getDate("DATA_ADMISSAO"));
                dto.setInicio(rs.getDate("INICIO"));
                dto.setTermino(rs.getDate("TERMINO"));
                dto.setCargaHorariaSemanal(rs.getInt("CARGA_HORARIA_SEMANAL"));
                dto.setValorMensal(rs.getDouble("VALOR_MENSAL"));

                // ------ agora, agrupa TODAS as especializações ------
                List<String> especs = new ArrayList<>();
                // especialização da primeira linha já lida
                especs.add(rs.getString("ESPECIALIZACAO"));
                // itera sobre possíveis linhas extras (mesmos dados fixos + outras especializações)
                while (rs.next()) {
                    especs.add(rs.getString("ESPECIALIZACAO"));
                }
                dto.setEspecializacao(especs);

                return dto;
            }
        }
    }
}