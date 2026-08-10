package com.routinetracker.repository;

import com.routinetracker.entity.TipoToken;
import com.routinetracker.entity.TokenCuenta;
import com.routinetracker.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface TokenCuentaRepository extends JpaRepository<TokenCuenta, Long> {

    Optional<TokenCuenta> findByTokenAndTipo(String token, TipoToken tipo);

    long countByUsuarioAndTipoAndFechaCreacionAfter(Usuario usuario, TipoToken tipo, LocalDateTime desde);

    Optional<TokenCuenta> findFirstByUsuarioAndTipoOrderByFechaCreacionDesc(Usuario usuario, TipoToken tipo);

    @Modifying
    @Query("update TokenCuenta t set t.usado = true where t.usuario = :usuario and t.tipo = :tipo and t.usado = false")
    void invalidarPendientes(@Param("usuario") Usuario usuario, @Param("tipo") TipoToken tipo);
}
