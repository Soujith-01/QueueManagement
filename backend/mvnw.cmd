@echo off
setlocal
if not defined JAVA_HOME (
    set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-25.0.3.9-hotspot"
)
"%~dp0..\tools\apache-maven-3.9.6\bin\mvn.cmd" %*
