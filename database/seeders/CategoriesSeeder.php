<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Category::create([
            'name' => '2 Wheeler',
        ]);

        Category::create([
            'name' => '3 Wheeler',
        ]);

        Category::create([
            'name' => '4 Wheeler',
        ]);
    }
}
