package com.example.oracleapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.*;

@Service
public class LoginService {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String fazerLogin(LoginDTO loginDTO) throws SQLException {
        String sql = "SELECT senha FROM T09D_LOGIN WHERE login = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, loginDTO.getLogin());

            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    throw new SQLException("Usuário não encontrado");
                }

                String hashed = rs.getString("senha");

                if (!passwordEncoder.matches(loginDTO.getSenha(), hashed)) {
                    throw new SQLException("Credenciais inválidas");
                }

                return "Login realizado com sucesso";
            }
        }
    }
}