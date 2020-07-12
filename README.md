## Настройка и использование VSCode

В проекте уже есть все конфигурационные файлы, давайте использовать общие на всех. Что-то для себя можно включить в настройках приложения или предложить включить всем.

### Расширения для vscode
* msjsdiag.debugger-for-chrome - Чтобы работал дебагер хрома
* editorconfig.editorconfig - Чтобы подгрузилась настройка пробелов/отступов

### Запуск отладчика Пишем в консоль npm start
* Переходим во вкладку Run или жмём ctrl+shift+d
* Жмём зелёную кнопку play. Запустится отдельное окно хрома, не склеиваемое с остальными окнами (нельзя открыть как вкладку), в нём будут грузится сорсмапы

## Структура кода и архитектура приложения
### Файловая структура
В src три 4 папки и роутеры:
* compnents - для компонентов, касающихся специфики проекта, имплеменирующих конкретный модуль. Компоненты вызываются страницами и другими компонентами один раз, редко два
* models - модели. Модели отвечают за состояние компонентов, подрузку данных с сервера
* pages - страницы, описывающие макрокод, определяющий внешний вид страницы. Каждый компонент, описанный в pages соответствует уникальному url, страницы используются только роутерами, роутеры используют только страницы
* utils - используемые в нескольких местах или не реализующие какую-то специфичную для проекта логику, упрощающие разработку основных компонентов. Утилзы не могут использовать компоненты
* Роутеры - Компоненты, определённые вне папок и определяющие путь к страницам. Существует два основных роутера: RootRouter, определяющий url до авторизации и AuthorizedRouter, определяющий маршрутизацию когда авторизация пройдена


### Система инстанцирования моделей и буферизация
Любая модель принадлежит какому-то компоненту либо модели. Модель должна инстанцироваться настолько поздно насколько это возможно и принадлежать самому глубокому компоненту, охватывающему компоненты, использующие модель. Модель авторизации принадлежит authorizedRouter и инстанцируется в нём. Все данные пользователя хранятся в auth, включая любые кешируемые данные. Такой подход позволяет гарантировать полную очистку всех пользовательских данных в случае logout. Любые кешируемые данные хранятся в модели auth, время жизни любого кеша на данном этапе развития проекта ограничено временем существования вкладки бразуера. Это ставит разумное ограничение на сложность отладки.

### Разработка компонентов, осуществляющих изменение данных с сервера
Любые изменения данных, загружаемых в модели с сервера должны осуществляться транзакционно. Например, если мы разрабатываем компонент, осуществляющий изменение пользовательских данных то для компонента, определяющего интерфейс редактора должна создаваться копия модели пользователя и все изменения должны осщуествляться в этой копии и при нажатии "сохранить" изменённые данные должны передаваться модели, управляющей загруженными данными пользователя, эта модель должна выслать данные на сервер и после получения сообщения об успешном получении данных сервером должна изменять данные пользователя внутри себя. Недопустим прямой доступ полей ввода и других редактирующих компонентов в модели, хранящие данные, загруженные с сервера.
