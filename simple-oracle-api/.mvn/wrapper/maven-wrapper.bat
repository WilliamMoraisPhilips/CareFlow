@echo off
@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Bootstrap Script for Windows
@REM ----------------------------------------------------------------------------

@setlocal

set MVNW_REPOURL=https://repo.maven.apache.org/maven2
set WRAPPER_JAR_PATH=.mvn\\wrapper\\maven-wrapper.jar
set WRAPPER_MAIN_CLASS=org.apache.maven.wrapper.MavenWrapperMain

if not exist "%WRAPPER_JAR_PATH%" (
  echo The wrapper jar file could not be found at %WRAPPER_JAR_PATH%
  exit /B 1
)

set CMD_LINE_ARGS=%*
java -cp "%WRAPPER_JAR_PATH%" %WRAPPER_MAIN_CLASS% %CMD_LINE_ARGS%
