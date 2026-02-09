@echo off
echo ========================================
echo Настройка брандмауэра для AR Бургера
echo ========================================
echo.

echo Добавление правила для порта 8443 (HTTPS)...
netsh advfirewall firewall add rule name="Node.js HTTPS Server" dir=in action=allow protocol=TCP localport=8443

if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] Правило успешно добавлено!
    echo.
    echo Теперь сервер должен быть доступен с телефона.
    echo.
) else (
    echo.
    echo [ERROR] Не удалось добавить правило.
    echo Убедитесь, что запускаете этот файл от имени администратора.
    echo.
)

echo ========================================
echo Нажмите любую клавишу для выхода...
pause >nul
