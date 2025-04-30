import { View, Text, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, TrashIcon } from 'react-native-heroicons/outline';
import { AntDesign } from '@expo/vector-icons';

const Search = () => {
  const initialSearches = [
    'Jeans',
    'Casual clothes',
    'Hoodie',
    'Nike shoes black',
    'V-neck tshirt',
    'Winter clothes',
  ];

  const [search, setSearch] = useState('');
  const [searches, setSearches] = useState(initialSearches);

  const handleRemove = (item: string) => {
    setSearches((prev) => prev.filter((i) => i !== item));
  };

  const handleClearAll = () => {
    setSearches([]);
  };

  const filtered = searches.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 bg-white pt-14 px-4">
      <View className='flex-row items-center justify-between mb-8'>
        <TouchableOpacity>
          <AntDesign name='left' size={20}/>
        </TouchableOpacity>
        <Text className='text-2xl font-bold text-center'>Search Products</Text>
        <Text className='text-2xl font-bold text-center'></Text>
      </View>
      {/* Search Input */}
      <View className="flex-row items-center bg-[#eee] rounded-lg px-3 py-4 mb-4 mt-8">
        <MagnifyingGlassIcon size={20} color="#888" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Find your favorite items"
          placeholderTextColor="#888"
          className="flex-1 ml-2 text-black"
        />
        <TouchableOpacity>
          <AntDesign name='search1' size={18}/>
        </TouchableOpacity>
      </View>

      {/* Heading and Clear All */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-black text-lg font-medium">Popular Searches</Text>
        {searches.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text className="text-black-400 font-bold text-lg">Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search List */}
      {filtered.length > 0 ? (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View className="flex-row justify-between items-center py-4 border-b border-[#ddd]">
              <Text className="text-black text-lg font-semibold">{item}</Text>
              <TouchableOpacity onPress={() => handleRemove(item)}>
                <XMarkIcon size={18} color="#aaa" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text className="text-gray-500 text-center mt-10" style={{marginTop: 250}}>No results found</Text>
      )}
    </View>
  );
};

export default Search;
