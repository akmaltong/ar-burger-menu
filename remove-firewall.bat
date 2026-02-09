@echo off
echo ========================================
echo Удаление правил брандмауэра для AR Бургера
echo ========================================
echo.

echo Удаление правила для порта 8443 (HTTPS)...
netsh advfirewall firewall delete rule name="Node.js HTTPS Server"

if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] Правило успешно удалено!
    echo.
) else (
    echo.
    echo [INFO] Правило не найдено или уже удалено.
    echo.
)

echo ========================================
echo Нажмите любую клавишу для выхода...
pause >nul
