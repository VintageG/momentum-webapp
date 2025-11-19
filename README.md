<h1>Momentum - Habbit Tracker and Note Taking App</h1>

<h4>How to run this project on your local pc:</h4>

<p>Step 1: Clone this repository using bash/git<br>
    <code> git clone https://github.com/arjaycode/momentum-webapp.git</code>
</p>


<p>Step 2: Install the project dependencies using composer on your terminal<br>
    <code> composer install</code>
</p>


<p>Step 3: Create the .env file using your terminal<br>
    <code> cp .env.example .env</code>
</p>


<p>Step 4: Uncomment the lines inside the .env file</p>

<p>Step 5: Insert the APP_KEY line in the .env file if not present</p>

<p>Step 6: On your terminal run the this command<br>
<code> php artisan key:generate </code><br>
    this should create the key needed for the project inside the .env file
</p>

<p>Step 7: configure your .env for your database<br>
<code> 
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=momentum_webapp
DB_USERNAME=root
DB_PASSWORD= 
</code><br>
    assuming you are already running a mysql server from wamp or xampp
</p>



<p>Step 8: on your terminal run this command<br>
<code> php artisan migrate</code><br>
    this will migrate your migration files to create the local database
</p>

<p>Step 9: on your terminal run this command<br>
<code> php artisan optimize</code><br>
</p>

<p>Step 10: on your terminal run this command<br>
<code> php artisan serve</code><br>
</p>


