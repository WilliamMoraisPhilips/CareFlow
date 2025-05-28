package com.example.oracleapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Types;

@Service
public class LoginService {

    @Autowired
    private DataSource dataSource;

    public String fazerLogin(LoginDTO loginDTO) throws SQLException {
        String resultado;

        try (Connection conn = dataSource.getConnection();
             CallableStatement stmt = conn.prepareCall("{call T09D_P_FAZER_LOGIN(?, ?, ?)}")) {

            stmt.setString(1, loginDTO.getLogin());
            stmt.setString(2, loginDTO.getSenha());
            stmt.registerOutParameter(3, Types.VARCHAR);

            stmt.execute();

            resultado = stmt.getString(3);
        }

        return resultado;
    }
}
// This code defines a LoginService class that uses Spring's @Service annotation to indicate that it is a service component.